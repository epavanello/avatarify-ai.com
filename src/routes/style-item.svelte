<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group';

	let { label, id } = $props<{ label: string; id: number }>();
</script>

<Label
	for={`${id}`}
	role="button"
	class="relative flex flex-col items-center justify-between rounded-lg overflow-hidden border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
>
	<RadioGroup.Item value={`${id}`} id={`${id}`} class="sr-only" aria-label={label} />
	<img src={`/s1_${id}.png`} alt={label} class="w-36 aspect-square" />
	<span class="style-title absolute bottom-1 left-0 w-full text-white text-center drop-shadow-sm">
		{label}
	</span>
</Label>

<style>
	.style-title {
		text-shadow:
			-1px -1px 0 #000,
			0 -1px 0 #000,
			1px -1px 0 #000,
			1px 0 0 #000,
			1px 1px 0 #000,
			0 1px 0 #000,
			-1px 1px 0 #000,
			-1px 0 0 #000;
	}
</style>
