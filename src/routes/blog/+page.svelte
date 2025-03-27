<script lang="ts">
  import PageContainer from '$lib/components/page-container.svelte';
  import SocialAvatar from '$lib/components/social-avatar.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { ArrowRightIcon } from 'lucide-svelte';
  import { formatDistanceToNow } from 'date-fns';
  import { format } from 'date-fns';
  import * as Card from '$lib/components/ui/card';
  const { data } = $props();

  const pages = $derived(data.pages);
</script>

<PageContainer
  title="Blog"
  meta={{
    title: 'Blog',
    description: 'Blog',
    keywords: ['blog']
  }}
  showCard={false}
>
  <div class="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
    {#each pages as page (page.path)}
      <Card.Root>
        <Card.Header>
          <Card.Title>
            <a href={`/blog/${page.path}`} class="transition-colors hover:text-primary">
              {page.metadata.title}
            </a>
          </Card.Title>
          {#if page.metadata.date}
            <div class="text-sm text-muted-foreground" title={format(page.metadata.date, 'LL')}>
              {formatDistanceToNow(page.metadata.date)} ago
            </div>
          {/if}
        </Card.Header>
        <Card.Content>
          <p class="text-muted-foreground">{page.metadata.description}</p>
        </Card.Content>
        <Card.Footer class="flex items-center justify-between">
          {#if page.metadata.author}
            <div class="flex items-center gap-2">
              <SocialAvatar profile={page.metadata.author} provider="twitter" size="sm" />
              <span class="text-sm text-muted-foreground">{page.metadata.author}</span>
            </div>
          {/if}
          <Button href={`/blog/${page.path}`} variant="ghost" class="text-primary">
            Read more
            <ArrowRightIcon class="size-4" />
          </Button>
        </Card.Footer>
      </Card.Root>
    {/each}
  </div>
</PageContainer>
