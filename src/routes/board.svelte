<script lang="ts">
  import { ImageWatermark } from 'watermark-js-plus';
  import { generatedImageURL, generationLoading } from './store';
  import { cn } from '$lib/utils';
  import type { EventHandler } from 'svelte/elements';
  import DaisyButton from '$lib/components/daisy/daisy-button.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { loadStripe } from '@stripe/stripe-js';
  import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

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

  async function buyCredit() {
    const stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) {
      console.error('Stripe not loaded');
      return;
    }

    const response = await fetch('/api/stripe-create-session', {
      method: 'POST'
    });
    const { clientSecret } = await response.json();

    // Initialize Checkout
    const checkout = await stripe.initEmbeddedCheckout({
      clientSecret
    });

    // Mount Checkout
    checkout.mount('#checkout');
  }

  let canDownload = false;

  onMount(async () => {
    // check if url contains session_id
    const session_id = $page.url.searchParams.get('session_id');
    if (session_id) {
      const stripeSession = await (
        await fetch(`/api/stripe-session-status?session_id=${session_id}`)
      ).json();
      if (stripeSession.status == 'open') {
        // Remount embedded Checkout
      } else if (stripeSession.status == 'complete') {
        canDownload = true;
        // Show success page
        // Optionally use session.payment_status or session.customer_email
        // to customize the success page
      }
    }
  });
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

  {#if canDownload}
    <DaisyButton
      variant="neutral"
      icon="download"
      class={cn({
        invisible: !$generatedImageURL
      })}>Download</DaisyButton
    >
  {:else}
    <Dialog.Root>
      <Dialog.Trigger asChild let:builder>
        <DaisyButton
          variant="neutral"
          icon="lock"
          builders={[builder]}
          class={cn({
            invisible: !$generatedImageURL
          })}>Download</DaisyButton
        >
      </Dialog.Trigger>
      <Dialog.Content class="max-h-[90%] max-w-lg overflow-auto">
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
          <DaisyButton variant="neutral" size="sm" icon="sell" on:click={buyCredit}
            >Buy credit</DaisyButton
          >
        </div>
      </Dialog.Content>
    </Dialog.Root>
  {/if}
</section>
