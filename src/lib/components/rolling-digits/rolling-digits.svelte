<script lang="ts">
  import Digit from './digit.svelte';
  import { cn } from '$lib/utils';

  export let value: number;
  export let fontSize = 14;
  export let lineHeight = 20;
  let classes = '';
  export { classes as class };

  $: digits = value.toString().split('').map(Number);
</script>

<span class={cn('digits', classes)} aria-label={value}>
  {#each digits as digit, i (digits.length - i)}
    <Digit value={digit} {fontSize} {lineHeight} />
  {/each}
</span>

<style>
  .digits {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
</style>
