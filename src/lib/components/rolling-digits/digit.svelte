<script lang="ts">
  export let value: number;
  export let fontSize;
  export let lineHeight;
</script>

<div
  class="digit-container"
  style="--font-size: {fontSize}px; --line-height: {lineHeight}px; --offset: {-value * lineHeight}px"
>
  {#each Array(10) as _, i}
    <div class="digit" class:active={i == value}>{i}</div>
  {/each}
</div>

<style>
  .digit {
    transition: opacity 0.3s ease-in;
    opacity: 0.2;
  }
  .active {
    opacity: 1;
  }
  .digit-container {
    display: inline-flex;
    flex-direction: column;
    text-align: center;

    line-height: var(--line-height);
    height: var(--line-height);
    font-size: var(--font-size);
    transform: translate(0, var(--offset));

    /* https://easings.net/#easeInOutCirc */
    transition: transform 0.5s cubic-bezier(0.85, 0, 0.15, 1);
  }
</style>
