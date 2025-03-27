import type { BlogProps } from '$lib/markdown-layout/blog.svelte';
import type { SvelteComponent } from 'svelte';

export async function load() {
  const files = import.meta.glob<{ default: SvelteComponent; metadata: Record<string, unknown> }>(
    './*/+page.md',
    {
      eager: true
    }
  );

  const pages = Object.entries(files)
    .map(([path, component]) => ({
      path: path.replace('/+page.md', ''),
      metadata: component.metadata as unknown as BlogProps
    }))
    .sort((a, b) => {
      if (!a.metadata.date || !b.metadata.date) {
        return 0;
      }
      return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
    });

  return {
    pages
  };
}
