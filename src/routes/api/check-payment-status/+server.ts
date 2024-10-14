import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import type { Database } from '$lib/supabase-types';

const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE);

export const GET: RequestHandler = async ({ locals: { session } }) => {
  if (!session || !session.user) {
    return error(401, 'Unauthorized');
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('user_payments')
      .select('remaining_generations')
      .eq('user_id', session.user.id)
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        hasPaid: data !== null,
        remainingGenerations: data?.remaining_generations || 0
      })
    );
  } catch (e) {
    console.error(e);
    return error(500, 'Database error');
  }
};
