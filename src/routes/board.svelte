<script lang="ts">
  import { ImageWatermark } from 'watermark-js-plus';
  import { generatedImageID, generationLoading } from './store';
  import { cn } from '$lib/utils';
  import DaisyButton from '$lib/components/daisy/daisy-button.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { loadStripe } from '@stripe/stripe-js';
  import { PUBLIC_STRIPE_PUBLISHABLE_KEY, PUBLIC_WEBSITE_HOST } from '$env/static/public';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { tick } from 'svelte';
  import { fade } from 'svelte/transition';

  async function buyCredit() {
    const stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) {
      console.error('Stripe not loaded');
      return;
    }

    const response = await fetch('/api/stripe-create-session', {
      method: 'POST',
      body: JSON.stringify({
        id: $generatedImageID
      })
    });
    const { clientSecret } = await response.json();

    // Initialize Checkout
    const checkout = await stripe.initEmbeddedCheckout({
      clientSecret
    });
    showStripe = true;
    await tick();

    // Mount Checkout
    checkout.mount('#checkout');
  }

  let canDownload = false;
  let showStripe = false;

  let randomId = Math.random().toString(36).substring(7);

  onMount(async () => {
    // check if url contains session_id
    const session_id = $page.url.searchParams.get('session_id');
    if (session_id) {
      const stripeSession = await (
        await fetch(`/api/stripe-session-status?session_id=${session_id}`)
      ).json();
      if (stripeSession.status == 'open') {
        buyCredit();
      } else if (stripeSession.status == 'complete') {
        canDownload = true;
        randomId = Math.random().toString(36).substring(7);
      }
    } else {
      const checkResult = await (await fetch(`/api/check-image/${$generatedImageID}`)).json();
      if (checkResult.ok) {
        canDownload = true;
        randomId = Math.random().toString(36).substring(7);
      }
    }
  });

  function download() {
    const a = document.createElement('a');
    a.href = `${PUBLIC_WEBSITE_HOST}/api/get-image/${$generatedImageID}?_=${randomId}`;
    a.download = 'generated-image.jpg';
    a.click();
  }
</script>

<section
  class="sticky top-0 flex flex-1 flex-col items-center justify-center gap-4 border-r border-neutral-content bg-base-200 p-4"
>
  <div
    class="photos-border relative flex aspect-[4/3] w-full max-w-xl flex-col items-center justify-center"
  >
    {#if $generationLoading}
      <span class="loading loading-infinity loading-lg"></span>
    {:else if $generatedImageID}
      <img
        src={`${PUBLIC_WEBSITE_HOST}/api/get-image/${$generatedImageID}?_=${randomId}`}
        alt="Generated"
        class={cn(
          'absolute h-full w-full origin-bottom-left translate-y-0 rotate-0 rounded-lg object-cover transition-all'
        )}
        crossorigin="anonymous"
        in:fade={{ duration: 300 }}
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
        invisible: !$generatedImageID
      })}
      on:click={download}>Download</DaisyButton
    >
  {:else}
    <Dialog.Root>
      <Dialog.Trigger asChild let:builder>
        <DaisyButton
          variant="neutral"
          icon="lock"
          builders={[builder]}
          class={cn({
            invisible: !$generatedImageID
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

{#if showStripe}
  <Dialog.Root open>
    <Dialog.Trigger asChild let:builder>
      <DaisyButton
        variant="neutral"
        icon="lock"
        builders={[builder]}
        class={cn({
          invisible: !$generatedImageID
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
    </Dialog.Content>
  </Dialog.Root>
{/if}
