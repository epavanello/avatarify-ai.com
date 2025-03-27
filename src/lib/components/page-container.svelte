<script lang="ts">
  import Title from '$lib/components/title.svelte';
  import * as Card from './ui/card';
  import Meta, { type MetaProps } from '$lib/SEO/meta.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    meta: MetaProps;
    title?: string;
    subtitle?: string;
    cardTitle?: string;
    cardDescription?: string;
    showCard?: boolean;
    actions?: Snippet;
    children?: Snippet;
  }

  let {
    meta,
    title = '',
    subtitle = '',
    cardTitle = '',
    cardDescription = '',
    showCard = true,
    actions,
    children
  }: Props = $props();
</script>

<Meta {...meta} />

{#if title}
  <Title class="mb-8" {subtitle} {actions}>{title}</Title>
{/if}

{#if showCard}
  <Card.Root>
    {#if cardTitle || cardDescription}
      <Card.Header>
        {#if cardTitle}
          <Card.Title>{cardTitle}</Card.Title>
        {/if}
        {#if cardDescription}
          <Card.Description>{cardDescription}</Card.Description>
        {/if}
      </Card.Header>
    {/if}
    <Card.Content>
      {@render children?.()}
    </Card.Content>
  </Card.Root>
{:else}
  {@render children?.()}
{/if}
