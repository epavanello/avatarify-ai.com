import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/supabase-types.js';
import { createBrowserClient, createServerClient, isBrowser, parse } from '@supabase/ssr';

export const load = async ({ fetch, data, depends }) => {
  depends('supabase:auth');

  const supabase = isBrowser()
    ? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch
        },
        cookies: {
          get(key) {
            const cookie = parse(document.cookie);
            return cookie[key];
          }
        }
      })
    : createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch
        },
        cookies: {
          get() {
            return JSON.stringify(data.session);
          }
        }
      });

  /**
   * It's fine to use `getSession` here, because on the client, `getSession` is
   * safe, and on the server, it reads `session` from the `LayoutData`, which
   * safely checked the session using `safeGetSession`.
   */
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return { session, supabase, user, dailyGeneratedImages: data.dailyGeneratedImages };
};
