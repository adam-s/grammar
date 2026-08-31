import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    watch: {
      // Processes that write into the tree — a production build, browser
      // suites saving screenshots, agents appending to their handoff log —
      // must not reload every open page. Nothing here is ever imported by
      // the app; watching it only breaks whoever is using the dev server.
      ignored: ['**/build/**', '**/test-results/**', '**/docs/**'],
    },
  },
});
