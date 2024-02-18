import Replicate from 'replicate';
import { createClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { PRIVATE_REPLICATE_API_TOKEN, PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import stylesServer from './styles.server';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { v4 as uuidv4 } from 'uuid';
import { toBase64 } from '$lib/utils';

const replicate = new Replicate({
  auth: PRIVATE_REPLICATE_API_TOKEN
});

const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE);

export const POST: RequestHandler = async ({ request, locals: { getSession } }) => {
  const [data, session] = await Promise.all([request.formData(), getSession()]);

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

  const id = uuidv4();

  const file = await supabase.storage.from('v2').upload(`upload/${session.user.id}/${id}`, image);

  if (file.error) {
    return error(500, 'Supabase error');
  }
  try {
    const signedUrl = await supabase.storage.from('v2').createSignedUrl(file.data.path, 60);

    if (signedUrl.error) {
      return error(500, 'Supabase error');
    }

    const output = (await replicate.run(
      'zsxkib/instant-id:6af8583c541261472e92155d87bba80d5ad98461665802f2ba196ac099aaedc9',
      {
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
          controlnet_conditioning_scale: 0.8
        }
      }
    )) as [string];

    // check if is an array and has a length of 1
    if (!Array.isArray(output) || output.length !== 1) {
      return error(500, 'Replicate error');
    }

    // Download the original image
    const original = await fetch(output[0]);
    const originalBuffer = await original.arrayBuffer();
    const originalBlob = new Blob([originalBuffer]);
    const originalFile = new File([originalBlob], 'original.png', { type: 'image/png' });

    // Upload the original image to Supabase
    const originalUpload = await supabase.storage
      .from('v2')
      .upload(`original/${session.user.id}/${id}`, originalFile);

    if (originalUpload.error) {
      return error(500, 'Supabase error');
    }

    return new Response(
      JSON.stringify({
        c:
          'data:image/png;base64,' +
          Buffer.from(await originalBlob.arrayBuffer()).toString('base64')
      }),
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return error(500, 'Replicate error');
  }
};
