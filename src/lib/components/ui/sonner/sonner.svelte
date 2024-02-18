<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner';
	import { mode } from 'mode-watcher';

	type $$Props = SonnerProps;
</script>

<Sonner
	theme={$mode}
	class="toaster group"
	toastOptions={{
		classes: {
			toast1:
				'group toast1 !flex-row group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
			description: 'group-[.toast1]:text-muted-foreground',
			actionButton: 'group-[.toast1]:bg-primary group-[.toast1]:text-primary-foreground',
			cancelButton: 'group-[.toast1]:bg-muted group-[.toast1]:text-muted-foreground'
		}
	}}
	{...$$restProps}
/>
