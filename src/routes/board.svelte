<script lang="ts">
  import { generatedImageID, generationLoading } from './store';
  import { cn } from '$lib/utils';
  import DaisyButton from '$lib/components/daisy/daisy-button.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { loadStripe, type StripeEmbeddedCheckout } from '@stripe/stripe-js';
  import { PUBLIC_STRIPE_PUBLISHABLE_KEY, PUBLIC_WEBSITE_HOST } from '$env/static/public';
  import { onMount, tick } from 'svelte';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { toast } from 'svelte-sonner';
  import Typewriter from 'svelte-typewriter';
  import { breakpoint } from '$lib/breakpoints';
  import Footer from '$lib/components/footer.svelte';

  let checkout: StripeEmbeddedCheckout | null = null;
  let board: HTMLElement;

  async function buyCredit() {
    window.plausible('OpenStripeCheckout');
    askBuyDialog = false;
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
    checkout = await stripe.initEmbeddedCheckout({
      clientSecret
    });
    showStripe = true;
  }

  function onShowStripe(el: HTMLDivElement) {
    if (el && checkout) {
      checkout.mount(el);
    }
    return {
      destroy() {
        if (checkout) {
          checkout.destroy();
        }
      }
    };
  }

  let canDownload = false;
  let showStripe = false;

  let randomId = Math.random().toString(36).substring(7);

  // a list with motivationals quotes to show on the board
  const motivationalsMessages = [
    'Less than your morning coffee for stunning results!',
    'Unlock premium quality for less than a dollar!',
    'Elevate your image at minimal cost!',
    'Invest in excellence for the price of a gum!',
    'Transform your profile without breaking the bank!',
    'Experience high definition for pocket change!',
    'Why wait? Upgrade your avatar for less now!',
    'Get professional looks for casual prices!',
    "Don't miss out on a bargain upgrade!",
    'Seize the HD difference for mere cents!'
  ];

  let motivationalMessage = '';

  function getRandomMotivationalMessage(): string {
    let message = '';
    do {
      message = motivationalsMessages[Math.floor(Math.random() * motivationalsMessages.length)];
    } while (message === motivationalMessage);
    return message;
  }

  motivationalMessage = getRandomMotivationalMessage();

  onMount(async () => {
    // check if url contains session_id
    const session_id = $page.url.searchParams.get('session_id');
    if (session_id) {
      const stripeSession = await (
        await fetch(`/api/stripe-session-status?session_id=${session_id}`)
      ).json();
      if (stripeSession.status == 'open') {
        toast.warning('Ops! Your payment is not completed yet.');
        buyCredit();
      } else if (stripeSession.status == 'complete') {
        canDownload = true;
        toast.success('Your photo is ready to download!');
        randomId = Math.random().toString(36).substring(7);
        // replace the url without session
        history.replaceState({}, document.title, '/');
      }
    } else if ($generatedImageID) {
      const checkResult = await (await fetch(`/api/check-payment/${$generatedImageID}`)).json();
      if (checkResult.ok) {
        canDownload = true;
        randomId = Math.random().toString(36).substring(7);
      }
    }
  });

  function getImageUrl() {
    return `${PUBLIC_WEBSITE_HOST}/api/get-image/${$generatedImageID}?_=${randomId}`;
  }

  function download() {
    const a = document.createElement('a');
    a.href = getImageUrl();
    a.download = 'generated-image.jpg';
    a.click();
  }

  let imageLoaded = false;
  let interval: NodeJS.Timeout;
  generatedImageID.subscribe(async (value) => {
    if (value) {
      imageLoaded = false;
      canDownload = false;
      if ($breakpoint.mobile) {
        await tick();
        board.scrollIntoView({ behavior: 'smooth' });
      }

      // on each new image, check if the image is ready to download
      if (interval) clearInterval(interval);

      interval = setInterval(async () => {
        motivationalMessage = getRandomMotivationalMessage();
        const checkResult = await fetch(`/api/get-image/${value}`);
        if (checkResult.status === 200) {
          randomId = Math.random().toString(36).substring(7);
          window.plausible('ImageGenerated');
          clearInterval(interval);
        }
      }, 5000);
    } else {
      imageLoaded = true;
    }
  });
  function onImageLoad() {
    console.log('image loaded');
    imageLoaded = true;
  }

  let askBuyDialog = false;
</script>

<section
  class="top-0 flex flex-1 flex-col items-center justify-center gap-4 bg-base-200 p-4 md:sticky md:min-h-[520px] md:border-r md:border-neutral-content"
  bind:this={board}
>
  <div class="absolute top-8">
    <a
      href="https://www.producthunt.com/posts/avatarify-ai?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-avatarify&#0045;ai"
      target="_blank"
      class="hidden dark:hidden md:block"
    >
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=440843&theme=light"
        alt="Avatarify&#0032;AI - The&#0032;AI&#0045;powered&#0032;profile&#0032;photo&#0032;generator | Product Hunt"
        style="width: 250px; height: 54px;"
        width="250"
        height="54"
      />
    </a>
    <a
      href="https://www.producthunt.com/posts/avatarify-ai?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-avatarify&#0045;ai"
      target="_blank"
      class="hidden dark:block"
    >
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=440843&theme=neutral"
        alt="Avatarify&#0032;AI - The&#0032;AI&#0045;powered&#0032;profile&#0032;photo&#0032;generator | Product Hunt"
        style="width: 250px; height: 54px;"
        width="250"
        height="54"
      />
    </a>
  </div>

  <div
    class="photos-border relative flex aspect-[4/3] w-full max-w-xl flex-col items-center justify-center gap-4 bg-base-100"
  >
    {#if $generationLoading || !imageLoaded}
      <span class="loading loading-infinity loading-lg"></span>
    {/if}

    {#if $generatedImageID}
      <img
        src={`${PUBLIC_WEBSITE_HOST}/api/get-image/${$generatedImageID}?_=${randomId}`}
        alt="Generated"
        class={cn(
          'absolute h-full w-full origin-bottom-left translate-y-0 rotate-0 rounded-lg object-cover opacity-100 transition-all',
          {
            'opacity-0': !imageLoaded
          }
        )}
        crossorigin="anonymous"
        in:fade={{ duration: 300 }}
        on:load={onImageLoad}
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
    {/if}
    {#if $generationLoading || !imageLoaded || !$generatedImageID}
      <p class="px-8 text-center text-2xl font-bold text-neutral-content">
        {#if $generationLoading || !imageLoaded}
          Be patient, we are generating your photo...
        {:else}
          The generated photo will appear here
        {/if}
      </p>

      {#if $generationLoading || !imageLoaded}
        <Typewriter>
          <p class="px-8 text-center font-mono text-lg font-semibold text-neutral-content">
            {motivationalMessage}
          </p>
        </Typewriter>
      {/if}
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
  {:else if imageLoaded}
    <Dialog.Root
      bind:open={askBuyDialog}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          window.plausible('TryDownloadModal');
        }
      }}
    >
      <Dialog.Trigger asChild let:builder>
        <DaisyButton
          variant="neutral"
          icon="lock"
          builders={[builder]}
          class={cn({
            'hidden md:invisible': !$generatedImageID
          })}>Download</DaisyButton
        >
      </Dialog.Trigger>
      <Dialog.Content class="max-w-md overflow-auto">
        <Dialog.Header>
          <Dialog.Title>Do you like the result?</Dialog.Title>
          <Dialog.Description>
            Pay just <b>$0.97</b> and instantly download the selected avatar in high definition (1280x960)
            without any watermark.
          </Dialog.Description>
        </Dialog.Header>
        <div class="flex flex-row justify-between">
          <DaisyButton
            size="sm"
            on:click={() => {
              askBuyDialog = false;
              window.plausible('UndoTryDownload');
            }}>Cancel</DaisyButton
          >
          <DaisyButton variant="neutral" size="sm" icon="sell" on:click={buyCredit}
            >Buy now
          </DaisyButton>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  {/if}

  <Dialog.Root
    bind:open={showStripe}
    onOpenChange={(isOpen) => {
      if (!isOpen) {
        window.plausible('CloseStripeCheckout');
      }
    }}
  >
    <Dialog.Content class="max-h-full max-w-[1100px] overflow-auto px-0 lg:max-h-[80%]">
      <div use:onShowStripe>
        <!-- Checkout will insert the payment form here -->
      </div>
    </Dialog.Content>
  </Dialog.Root>

  <Footer class="absolute hidden md:block" />
</section>
