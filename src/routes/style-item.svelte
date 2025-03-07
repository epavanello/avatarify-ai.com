<script lang="ts">
  import Label from '$lib/components/ui/label/label.svelte';
  import * as RadioGroup from '$lib/components/ui/radio-group';

  type $$Props = { name: string; label?: string };
  export let name: $$Props['name'];
  export let label: string | undefined = name;
</script>

<Label
  for={name}
  role="button"
  class="relative flex aspect-square flex-col items-center justify-between overflow-hidden rounded-lg bg-base-200 outline-none outline-offset-2 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:outline-dashed [&:has([data-state=checked])]:outline-2 [&:has([data-state=checked])]:outline-primary"
>
  <RadioGroup.Item value={name} id={name} class="sr-only" aria-label={name} />
  <slot name="icon">
    <img src={`/${name}.png`} alt={name} class="aspect-square w-full" />
  </slot>
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
