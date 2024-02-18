import { error } from '@sveltejs/kit';
import sharp from 'sharp';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';

const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE);

export const GET: RequestHandler = async ({ params, locals: { getSession } }) => {
  const session = await getSession();

  if (!session || !session.user) {
    return error(401, 'Unauthorized');
  }
  if (!params.id) {
    return error(400, 'Missing id');
  }
  try {
    const searchPayment = await supabaseAdmin
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('picture_id', params.id)
      .eq('uid', session.user.id);
    if (searchPayment.error) {
      return error(500, 'Supabase error');
    }
    return new Response(
      JSON.stringify({
        ok: searchPayment.count === 1
      }),
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return error(500, 'Generic error');
  }
};
