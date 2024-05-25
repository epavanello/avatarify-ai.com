// See https://kit.svelte.dev/docs/types#app

import type { Database } from '$lib/supabase-types';
import type { Session, User, SupabaseClient } from '@supabase/supabase-js';

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
      session: Session | null;
      user: User | null;
    }
    interface PageData {
      user?: User;
    }
  }

  interface Window {
    plausible: {
      (eventName: string, options?: Record<string, unknown>): void;
      q: Array<[string, Record<string, unknown>?]>;
    };
  }
}

export {};
