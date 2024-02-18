<script lang="ts">
  import { ImageWatermark } from 'watermark-js-plus';
  import { generatedImageURL, generationLoading } from './store';
  import { cn } from '$lib/utils';
  import type { EventHandler } from 'svelte/elements';
  import DaisyButton from '$lib/components/daisy/daisy-button.svelte';
  import * as Dialog from '$lib/components/ui/dialog';

  let watermark: ImageWatermark | null = null;

  let lastUrl = '';

  let imageIsOk = false;

  const onLoadImage: EventHandler<Event, Element> = async (e) => {
    const target = e.target as HTMLImageElement;
    console.log('onLoadImage');
    if (!e.target) return;
    imageIsOk = lastUrl === target.src;
    if (imageIsOk) return;

    if (watermark) {
      watermark.destroy();
      watermark = null;
    }
    watermark = new ImageWatermark({
      content: 'AvatarifyAI',
      width: target.width,
      height: target.height,
      dom: target,
      fontColor: '#fff',
      globalAlpha: 0.3,
      fontSize: '60px',
      rotate: 12,
      shadowStyle: {
        shadowBlur: 10,
        shadowColor: '#00000044',
        shadowOffsetX: 0,
        shadowOffsetY: 0
      }
    });
    await watermark.create();
    console.log('watermark created');
    lastUrl = target.src;
  };
</script>

<section
  class="sticky top-0 flex flex-1 flex-col items-center justify-center gap-4 border-r border-neutral-content bg-base-200 p-4"
>
  <div
    class="photos-border relative flex aspect-[4/3] w-full max-w-xl flex-col items-center justify-center"
  >
    {#if $generationLoading}
      <span class="loading loading-infinity loading-lg"></span>
    {:else if $generatedImageURL}
      <img
        src={$generatedImageURL}
        on:load={onLoadImage}
        alt="Generated"
        class={cn(
          'absolute h-full w-full origin-bottom-left translate-y-0 rotate-0 rounded-lg object-cover transition-all',
          { 'opacity-0': !imageIsOk }
        )}
        crossorigin="anonymous"
      />
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-interactive-supports-focus -->
      <div
        class="pointer-events-auto absolute inset-0 cursor-default"
        role="button"
        on:click={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      ></div>
    {:else}
      <p class="text-2xl font-bold text-neutral-content">Your photo will appear here</p>
    {/if}
  </div>

  <Dialog.Root>
    <Dialog.Trigger asChild let:builder>
      <DaisyButton
        variant="neutral"
        icon="download"
        builders={[builder]}
        class={cn({
          invisible: !$generatedImageURL
        })}>Download</DaisyButton
      >
    </Dialog.Trigger>
    <Dialog.Content class="max-w-md">
      <Dialog.Header>
        <Dialog.Title>Download your photo</Dialog.Title>
        <Dialog.Description>
          Do you like the result?<br />
          Buy a credit to download the photo in high resolution.
        </Dialog.Description>
      </Dialog.Header>

      <div id="checkout">
        <!-- Checkout will insert the payment form here -->
      </div>
      <div class="flex flex-row justify-between">
        <DaisyButton size="sm">Cancel</DaisyButton>
        <DaisyButton variant="neutral" size="sm" icon="sell">Buy credit</DaisyButton>
      </div>
    </Dialog.Content>
  </Dialog.Root>
</section>
