<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group';

	type $$Props = { label: string; id: number };
	export let label: $$Props['label'];
	export let id: $$Props['id'];
</script>

<Label
	for={`${id}`}
	role="button"
	class="relative flex flex-col items-center justify-between overflow-hidden rounded-lg border-4 border-muted bg-popover hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-base-content"
>
	<RadioGroup.Item value={`${id}`} id={`${id}`} class="sr-only" aria-label={label} />
	<img src={`/s1_${id}.png`} alt={label} class="aspect-square w-36" />
	<span class="style-title absolute bottom-1 left-0 w-full text-center text-white drop-shadow-sm">
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
