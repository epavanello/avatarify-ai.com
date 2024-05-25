<script lang="ts">
  import Label from '$lib/components/ui/label/label.svelte';
  import * as RadioGroup from '$lib/components/ui/radio-group';

  type $$Props = { name: string };
  export let name: $$Props['name'];
</script>

<Label
  for={name}
  role="button"
  class="relative flex aspect-square flex-col items-center justify-between overflow-hidden rounded-lg bg-popover outline-none outline-offset-2 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:outline-dashed [&:has([data-state=checked])]:outline-3 [&:has([data-state=checked])]:outline-primary"
>
<RadioGroup.Item value={name} id={name} class="sr-only" aria-label={name} />
<img src={`/${name}.png`} alt={name} class="aspect-square w-full" />
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
