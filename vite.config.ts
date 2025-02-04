import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [sveltekit()],
    server: {
      allowedHosts: mode === 'development' ? [new URL(env.PUBLIC_WEBSITE_HOST).host] : undefined
    }
  };
});
