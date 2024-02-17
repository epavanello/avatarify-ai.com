<script>
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.pcss';
	import Board from './board.svelte';
	import Header from './header.svelte';
	import Sidebar from './sidebar.svelte';
</script>

<Header />

<main class="flex flex-1 flex-row overflow-auto">
	<Board />
	<Sidebar />
</main>

<Toaster richColors position="bottom-left" />
