<script lang="ts">
  import '../app.pcss';
  import { invalidate } from '$app/navigation';
  import { Toaster } from '$lib/components/ui/sonner';
  import { ModeWatcher } from 'mode-watcher';
  import { onMount } from 'svelte';
  import Header from './header.svelte';
  import Footer from '$lib/components/footer.svelte';

  let { data, children } = $props();
  let { session, supabase } = $derived(data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<ModeWatcher defaultMode={'light'} track={false}></ModeWatcher>
<Toaster
  richColors
  toastOptions={{
    class: 'my-toast'
  }}
  position="bottom-left"
/>

<Header supabase={data.supabase} user={data.user} />

<main class="flex flex-1 flex-col overflow-auto md:flex-row">
  {@render children?.()}
</main>

<Footer class="absolute hidden md:block" />
