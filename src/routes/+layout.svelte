<script lang="ts">
  import { goto, invalidate } from '$app/navigation';
  import { Toaster } from '$lib/components/ui/sonner';
  import { ModeWatcher } from 'mode-watcher';
  import { onMount } from 'svelte';

  export let data;
  $: ({ session, supabase } = data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (!newSession) {
        /**
         * Queue this as a task so the navigation won't prevent the
         * triggering function from completing
         */
        setTimeout(() => {
          goto('/', { invalidateAll: true });
        });
      }
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<slot />

<ModeWatcher defaultMode={'light'} track={false}></ModeWatcher>
<Toaster richColors position="bottom-left" />
