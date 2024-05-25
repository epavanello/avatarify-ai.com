import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/supabase-types.js';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE);

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { session } }) => {
  let dailyGeneratedImages = 0;
  if (session) {
    const today = new Date().toISOString().split('T')[0];
    dailyGeneratedImages =
      (
        await supabaseAdmin
          .from('generations')
          .select('*', { count: 'exact', head: true })
          .eq('uid', session.user.id)
          .eq('day', today)
          .throwOnError()
      ).count || 0;
  }
  return {
    session,
    dailyGeneratedImages
  };
};
