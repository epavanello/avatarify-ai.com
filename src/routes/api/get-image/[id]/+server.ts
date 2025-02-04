import { error } from '@sveltejs/kit';
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

  const file = await supabaseAdmin.storage
    .from('v2')
    .download(`original/${session.user.id}/${params.id}`);

  if (file.error) {
    return error(404, 'Not found');
  }

  const arrayBuffer = await file.data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Response(buffer);
};
