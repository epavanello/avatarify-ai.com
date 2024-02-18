<script lang="ts">
  import Label from '$lib/components/ui/label/label.svelte';
  import * as RadioGroup from '$lib/components/ui/radio-group';

  type $$Props = { name: string };
  export let name: $$Props['name'];
</script>

<Label
  for={name}
  role="button"
  class="relative flex flex-col items-center justify-between overflow-hidden rounded-lg border-4 border-muted bg-popover hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-base-content"
>
  <RadioGroup.Item value={name} id={name} class="sr-only" aria-label={name} />
  <img src={`/${name}.png`} alt={name} class="aspect-square w-36" />
  <span class="style-title absolute bottom-1 left-0 w-full text-center text-white drop-shadow-sm">
    {name}
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
