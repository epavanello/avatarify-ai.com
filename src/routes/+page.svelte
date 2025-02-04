<script>
  import '../app.pcss';
  import Board from './board.svelte';
  import Header from './header.svelte';
  import Sidebar from './sidebar.svelte';

  let { data } = $props();

  const { images, remainingGenerations } = $derived(data);
</script>

<Header supabase={data.supabase} user={data.user} />

<main class="flex flex-1 flex-col overflow-auto md:flex-row">
  <Board user={data.user} {images} />
  <Sidebar user={data.user} {remainingGenerations} />
</main>
