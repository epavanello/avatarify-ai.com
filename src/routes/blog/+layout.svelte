<script lang="ts">
  let { children } = $props();
</script>

<main class="mx-auto mt-16 flex max-w-2xl flex-1 flex-col p-4 text-left">
  {@render children()}
</main>
