<script lang="ts">
  import { page } from '$app/state';
  import { PUBLIC_WEBSITE_HOST } from '$env/static/public';
  import config from '$lib/config';

  export interface MetaProps {
    description?: string;
    title?: string;
    type?: 'website' | 'article';
    date?: Date;
    keywords?: string[];
    author?: string;
  }
  const {
    description = config.description,
    title = config.name,
    type = 'website',
    date,
    keywords = [],
    author = ''
  }: MetaProps = $props();

  const canonical = $derived(`${PUBLIC_WEBSITE_HOST}${page.url.pathname}`);

  let fullTitle = $derived(config.name + (title ? ` | ${title}` : ''));
</script>

<svelte:head>
  <meta name="robots" content="{config.noIndex ? 'noindex' : 'index'},follow" />
  <link rel="manifest" href="/manifest.json" />
  <meta property="og:image" content="{PUBLIC_WEBSITE_HOST}/og-image.webp" />
  <link rel="canonical" href={canonical} />
  {#if type}
    <meta property="og:type" content={type} />
  {/if}

  <!-- Title -->
  {#if fullTitle}
    <title>{fullTitle}</title>
    <meta property="og:title" content={fullTitle} />
    <meta name="twitter:title" content={fullTitle} />
    <meta property="og:image:alt" content={fullTitle} />
  {/if}

  <!-- Description -->
  {#if description}
    <meta property="og:description" content={description} />
    <meta name="description" content={description} />
    <meta name="twitter:description" content={description} />
  {/if}

  {#if date}
    <meta property="article:published_time" content={date.toISOString()} />
  {/if}
  {#if keywords}
    <meta name="keywords" content={keywords.join(', ')} />
  {/if}
  {#each keywords as keyword, i (i)}
    <meta property="article:tag" content={keyword} />
  {/each}
  {#if author}
    <meta property="article:author" content={author} />
  {/if}
</svelte:head>
