<script>
  import '../app.pcss';
  import Board from './board.svelte';
  import Header from './header.svelte';
  import Sidebar from './sidebar.svelte';

  export let data;
</script>

<Header supabase={data.supabase} session={data.session} />

<main class="flex flex-1 flex-col overflow-auto md:flex-row">
  <Board />
  <Sidebar session={data.session} />
</main>
