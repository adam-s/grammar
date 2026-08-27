<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <title>Grammar</title>
</svelte:head>

{@render children?.()}
