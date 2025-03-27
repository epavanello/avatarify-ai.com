<script lang="ts">
  import type { Snippet } from 'svelte';
  import PageContainer from '$lib/components/page-container.svelte';

  export interface BlogProps {
    title: string;
    description?: string;
    date?: string;
    keywords?: string;
    author?: string;
    readingTime?: string;
  }
  const {
    title,
    description = '',
    date,
    keywords = '',
    author = '',
    readingTime = '',
    children
  }: BlogProps & { children: Snippet<[]> } = $props();

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';
</script>

<PageContainer
  {title}
  meta={{
    title,
    description,
    date: date ? new Date(date) : undefined,
    keywords: keywords.split(','),
    author
  }}
  showCard={false}
>
  <div class="flex items-center gap-3 text-sm text-muted-foreground">
    <span>{formattedDate}</span>
    {#if readingTime}
      <span>•</span>
      <span>{readingTime}</span>
    {/if}
  </div>
  <article class="prose prose-lg max-w-none">
    {@render children()}
  </article>
</PageContainer>
