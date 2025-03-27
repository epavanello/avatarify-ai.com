<script lang="ts">
  import { page } from '$app/state';
  import { PUBLIC_WEBSITE_HOST } from '$env/static/public';
  import { onMount, type Snippet } from 'svelte';
  import config from '$lib/config';
  import { Toaster } from '$lib/components/ui/sonner';
  const {
    children,
    loocalOG
  }: {
    children: Snippet;
    loocalOG?: boolean;
  } = $props();

  const sizesApple = [57, 60, 72, 76, 114, 120, 144, 152];
  const sizeIcons = [16, 32, 48, 96, 128, 180, 196];

  onMount(() => {
    document.fonts.load('12px Material Symbols Outlined').then(() => {
      document.body.classList.add('material-symbols-loaded');
    });
  });
</script>

<svelte:head>
  <link rel="canonical" href={`${PUBLIC_WEBSITE_HOST}${page.url.pathname}`} />

  <meta name="application-name" content={config.name} />

  <!-- Twitter -->
  {#if config.links.x}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@{config.links.x}" />
    <meta
      name="twitter:creator"
      content="@{config.links.x.substring(config.links.x.lastIndexOf('/') + 1)}"
    />
  {/if}

  <!-- OG -->
  <meta property="og:url" content={page.url.toString()} />
  <meta property="og:site_name" content={config.name} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  {#if loocalOG}
    <meta property="og:image" content="{PUBLIC_WEBSITE_HOST}{page.url.pathname}/og.png" />
  {:else}
    <meta property="og:image" content="{PUBLIC_WEBSITE_HOST}/og.png" />
  {/if}

  <!-- Extra -->
  <meta name="robots" content="{config.noIndex ? 'noindex' : 'index'},follow" />
  <link rel="manifest" href="/manifest.json" />
</svelte:head>

<Toaster
  richColors
  toastOptions={{
    class: 'my-toast'
  }}
/>
{@render children()}
