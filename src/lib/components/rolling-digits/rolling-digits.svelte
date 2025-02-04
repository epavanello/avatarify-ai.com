<script lang="ts">
  import Digit from './digit.svelte';
  import { cn } from '$lib/utils';

  interface Props {
    value: number;
    fontSize?: number;
    lineHeight?: number;
    class?: string;
  }

  let { value, fontSize = 14, lineHeight = 20, class: classes = '' }: Props = $props();

  let digits = $derived(value.toString().split('').map(Number));
</script>

<span class={cn('digits', classes)} aria-label={`${value}`}>
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
