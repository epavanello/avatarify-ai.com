import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md'],
      layout: {
        _: 'src/lib/markdown-layout/blog.svelte'
      }
    })
  ],

  kit: {
    adapter: adapter(),
    csrf: { checkOrigin: process.env.NODE_ENV === 'production' }
  }
};

export default config;
