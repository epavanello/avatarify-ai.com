<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';
  const {
    subtitle,
    children,
    class: className,
    actions,
    center = false
  }: {
    subtitle?: string;
    children: Snippet;
    class?: string;
    actions?: Snippet;
    center?: boolean;
  } = $props();
</script>

<div class={cn('mb-12', { 'text-center': center }, className)}>
  {#if actions}
    <div class="flex flex-row items-center justify-between gap-2">
      <h1 class="mb-0 text-3xl">
        {@render children()}
      </h1>
      {@render actions?.()}
    </div>
  {:else}
    <h1 class="mb-0 text-3xl">
      {@render children()}
    </h1>
  {/if}
  {#if subtitle}
    <h2 class={cn('text-legend text-muted-foreground', { 'text-center': center })}>
      {subtitle}
    </h2>
  {/if}
</div>
