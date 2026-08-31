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

<!-- The site byline, in the same shape every page on adamsohn.com wears it:
     fixed top-right, small mono, faint until hovered, hidden on phones. -->
<a class="byline" href="https://adamsohn.com">adamsohn.com</a>

{@render children?.()}

<style>
  .byline {
    position: fixed;
    /* Clear of the panel-collapse chevron that owns the exact corner. */
    top: 0.8rem;
    right: 3rem;
    z-index: 30;
    border-bottom: 1px solid var(--border-strong);
    color: var(--ink-faint);
    font-family: var(--font-mono);
    font-size: 0.74rem;
    text-decoration: none;
  }
  .byline:hover {
    color: var(--accent);
  }
  /* PHONE_QUERY from workspace/breakpoints.ts, which CSS cannot import. */
  @media (max-width: 700px) {
    .byline {
      display: none;
    }
  }
</style>
