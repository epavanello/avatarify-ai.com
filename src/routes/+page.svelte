<script>
  import { Toaster } from '$lib/components/ui/sonner';
  import '../app.pcss';
  import Board from './board.svelte';
  import Header from './header.svelte';
  import Sidebar from './sidebar.svelte';

  export let data;
</script>

<Header supabase={data.supabase} session={data.session} />

<main class="flex flex-1 flex-row overflow-auto">
  <Board />
  <Sidebar session={data.session} />
</main>

<Toaster richColors position="bottom-left" />
