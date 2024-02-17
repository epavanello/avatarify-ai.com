import Replicate from 'replicate';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { PRIVATE_REPLICATE_API_TOKEN } from '$env/static/private';
import stylesServer from './styles.server';

const replicate = new Replicate({
  auth: PRIVATE_REPLICATE_API_TOKEN
});

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.formData();

  const image = data.get('image');
  const style = stylesServer.find((s) => s.name === data.get('style'));

  if (!image || !style) {
    return error(400, 'Missing image or style');
  }

  try {
    const output = await replicate.run(
      'zsxkib/instant-id:6af8583c541261472e92155d87bba80d5ad98461665802f2ba196ac099aaedc9',
      {
        input: {
          image,
          width: 640,
          height: 640,
          prompt: style.prompt.replace('{prompt}', 'of a person'),
          scheduler: 'EulerDiscreteScheduler',
          enable_lcm: false,
          // pose_image: 'https://replicate.delivery/pbxt/KJmFdQRQVDXGDVdVXftLvFrrvgOPXXRXbzIVEyExPYYOFPyF/80048a6e6586759dbcb529e74a9042ca.jpeg',
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
    );
    return new Response(JSON.stringify(output), { status: 201 });
  } catch (e) {
    return error(500, 'Replicate error');
  }
};
