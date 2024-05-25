import { error } from '@sveltejs/kit';
import sharp from 'sharp';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';

const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE);

export const GET: RequestHandler = async ({ params, locals: { session } }) => {
  if (!session || !session.user) {
    return error(401, 'Unauthorized');
  }
  if (!params.id) {
    return error(400, 'Missing id');
  }
  const searchPayment = await supabaseAdmin
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .eq('picture_id', params.id)
    .eq('uid', session.user.id);
  if (searchPayment.error) {
    return error(500, 'Supabase error');
  }
  if (searchPayment.count === 1) {
    const file = await supabaseAdmin.storage
      .from('v2')
      .download(`original/${session.user.id}/${params.id}`);

    if (file.error) {
      return error(404, 'Not found');
    }

    const arrayBuffer = await file.data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Response(buffer);
  } else {
    const file = await supabaseAdmin.storage
      .from('v2')
      .download(`original/${session.user.id}/${params.id}`);

    if (file.error) {
      return error(404, 'Not found');
    }

    const arrayBuffer = await file.data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const svgImage = `
    <svg width="700" height="200">
      <style>
      .title { fill: #fff; font-size: 120px; font-weight: bold; opacity: 0.5; font-family: Arial, sans-serif;}
      </style>
      <text x="50%" y="50%" text-anchor="middle" class="title">AvatarifyAI</text>
    </svg>
    `;
    const svgBuffer = Buffer.from(svgImage);
    return new Response(
      await sharp(
        await sharp(buffer)
          .composite([
            {
              input: svgBuffer,
              top: 500,
              left: 290
            }
          ])
          .toBuffer()
      )
        .resize({
          width: 600,
          height: 450
        })
        .toBuffer()
    );
  }
};
