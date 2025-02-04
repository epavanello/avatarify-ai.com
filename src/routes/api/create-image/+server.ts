import Replicate from 'replicate';
import { createClient } from '@supabase/supabase-js';
import { error, type RequestHandler } from '@sveltejs/kit';
import { PRIVATE_REPLICATE_API_TOKEN, PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import stylesServer from './styles.server';
import { PUBLIC_SUPABASE_URL, PUBLIC_WEBSITE_HOST } from '$env/static/public';
import { v4 as uuidv4 } from 'uuid';
import type { Database } from '$lib/supabase-types';

const replicate = new Replicate({
  auth: PRIVATE_REPLICATE_API_TOKEN
});

const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE);

export const POST: RequestHandler = async ({ request, locals: { session } }) => {
  const data = await request.formData();

  const image = data.get('image');
  const style = stylesServer.find((s) => s.name === data.get('style'));

  if (!session || !session.user) {
    return error(401, 'Unauthorized');
  }

  if (!image || !style) {
    return error(400, 'Missing image or style');
  }

  if (!(image instanceof File)) {
    return error(400, 'Image is not a file');
  }

  // Check remaining generations first
  const { data: userPayment, error: userPaymentError } = await supabaseAdmin
    .from('user_payments')
    .select('remaining_generations')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (userPaymentError || !userPayment) {
    return error(400, 'User payment not found');
  }

  if (userPayment.remaining_generations <= 0) {
    return error(400, 'No remaining generations');
  }

  const id = uuidv4();

  // Decrement remaining generations first to prevent race conditions
  await supabaseAdmin
    .from('user_payments')
    .update({ remaining_generations: userPayment.remaining_generations - 1 })
    .eq('user_id', session.user.id)
    .throwOnError();

  const file = await supabaseAdmin.storage
    .from('v2')
    .upload(`upload/${session.user.id}/${id}`, image);

  if (file.error) {
    return error(500, 'Supabase error');
  }
  try {
    const signedUrl = await supabaseAdmin.storage.from('v2').createSignedUrl(file.data.path, 300);

    if (signedUrl.error) {
      return error(500, 'Supabase error');
    }

    // https://replicate.com/collections/use-face-to-make-images
    const output = await replicate.predictions.create({
      version: '6af8583c541261472e92155d87bba80d5ad98461665802f2ba196ac099aaedc9',
      webhook: `${PUBLIC_WEBSITE_HOST}/api/replicate-webhook`,
      webhook_events_filter: ['completed'],
      input: {
        image: signedUrl.data.signedUrl,
        width: 640,
        height: 640,
        prompt: style.prompt.replace('{prompt}', 'of a person'),
        scheduler: 'EulerDiscreteScheduler',
        enable_lcm: false,
        sdxl_weights: 'protovision-xl-high-fidel',
        pose_strength: 0.4,
        canny_strength: 0.3,
        depth_strength: 0.5,
        guidance_scale: 5,
        negative_prompt: style.negative_prompt,
        ip_adapter_scale: 0.8,
        lcm_guidance_scale: 1.5,
        num_inference_steps: 30,
        enable_pose_controlnet: true,
        enhance_nonface_region: true,
        enable_canny_controlnet: false,
        enable_depth_controlnet: false,
        lcm_num_inference_steps: 5,
        controlnet_conditioning_scale: 0.8,
        uid: session.user.id,
        id
      }
    });

    if (output.error) {
      console.error(output.error);
      return error(500, 'Replicate error');
    }

    return new Response(
      JSON.stringify({
        id,
        predictionID: output.id
      })
    );
  } catch (e) {
    console.error(e);
    return error(500, 'Replicate error');
  }
};
