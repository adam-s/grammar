<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { site } from '$lib/site';
  let { children } = $props();

  const image = site.origin + site.image.path;
</script>

<svelte:head>
  <title>Grammar</title>
  <meta name="description" content={site.description} />
  <!-- Twitter reads the og: tags for everything but the card shape. -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={site.name} />
  <meta property="og:title" content={site.name} />
  <meta property="og:description" content={site.description} />
  <meta property="og:url" content={site.origin + page.url.pathname} />
  <meta property="og:image" content={image} />
  <meta property="og:image:width" content={String(site.image.width)} />
  <meta property="og:image:height" content={String(site.image.height)} />
  <meta property="og:image:alt" content={site.imageAlt} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{@render children?.()}
