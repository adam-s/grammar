import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    // dist/, not SvelteKit's default build/, so the blog's scripts/sync-app.sh
    // deploys this like every other sub-app (algoviz does the same).
    adapter: adapter({ pages: 'dist', assets: 'dist', fallback: undefined, strict: true }),
    paths: { relative: true }
  }
};
