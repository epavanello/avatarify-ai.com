import { error } from '@sveltejs/kit';
import { type Prediction } from 'replicate';
import type { RequestHandler } from '../$types';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase-types';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';

const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE);

export const POST: RequestHandler = async ({ request }) => {
  try {
    const payload: Omit<Prediction, 'input' | 'output'> & {
      input: { uid: string; id: string };
      output: [string];
    } = await request.json();

    if (payload.status === 'succeeded') {
      const output = payload.output;
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
      const originalUpload = await supabaseAdmin.storage
        .from('v2')
        .upload(`original/${payload.input.uid}/${payload.input.id}`, originalFile);

      if (originalUpload.error) {
        return error(500, 'Supabase error');
      }
    }

    return new Response(JSON.stringify({}), { status: 201 });
  } catch (e) {
    console.error(e);
    return error(500, 'Replicate error');
  }
};
