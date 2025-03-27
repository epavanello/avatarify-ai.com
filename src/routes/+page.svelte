<script>
  import Board from './board.svelte';
  import Sidebar from './sidebar.svelte';

  let { data } = $props();

  const { images, remainingGenerations } = $derived(data);
</script>

<Board user={data.user} {images} />
<Sidebar user={data.user} {remainingGenerations} />
