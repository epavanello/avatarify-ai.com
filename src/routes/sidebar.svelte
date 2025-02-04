<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import * as Card from '$lib/components/ui/card';
  import * as RadioGroup from '$lib/components/ui/radio-group';
  import { Label } from '$lib/components/ui/label';
  import StyleItem from './style-item.svelte';
  import DaisyButton from '$lib/components/daisy/daisy-button.svelte';
  import DropZone from '$lib/components/drop-zone.svelte';
  import { toast } from 'svelte-sonner';
  import { cn } from '$lib/utils';
  import { tick } from 'svelte';
  import {
    blobImage,
    generatedImageID,
    generationLoading,
    highlightStyles,
    highlightLogin,
    highlightPhotoUpload
  } from './store';
  import type { User } from '@supabase/supabase-js';
  import { styles, type Styles } from './api/create-image/styles';
  import Footer from '$lib/components/footer.svelte';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import RollingDigits from '$lib/components/rolling-digits/rolling-digits.svelte';
  import { derived } from 'svelte/store';
  import * as Dialog from '$lib/components/ui/dialog';
  import { loadStripe, type StripeEmbeddedCheckout } from '@stripe/stripe-js';
  import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

  // https://github.com/InstantID/InstantID/blob/main/assets/0.png
  // https://github.com/ahgsql/StyleSelectorXL/blob/main/sdxl_styles.json

  let {
    user,
    remainingGenerations
  }: {
    user: User | null;
    remainingGenerations: number;
  } = $props();

  let dropZone: DropZone | undefined = $state();
  let capture = $state(false);
  let cameraIsReady = $state(false);
  let video: HTMLVideoElement | undefined = $state();
  let mouseOverDropZone = $state(false);
  let style: Styles | '' = $state('');
  let generateError = $state(false);
  let buyError = $state(false);
  let stream: MediaStream | undefined = $state();
  let askBuyDialog = $state(false);
  let checkout: StripeEmbeddedCheckout | null = null;
  let showStripe = $state(false);

  async function buyCredit() {
    window.plausible?.('OpenStripeCheckout');
    askBuyDialog = false;
    const stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) {
      console.error('Stripe not loaded');
      return;
    }

    const response = await fetch('/api/stripe-create-session', {
      method: 'POST',
      body: JSON.stringify({})
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

  const previewImage = derived(blobImage, (val) => (val ? URL.createObjectURL(val) : ''));

  function handleImageUpload(file?: File) {
    if (file) {
      blobImage.set(file);
      mouseOverDropZone = false;
    }
  }

  async function generate() {
    window.plausible?.('TryGenerateImage');
    if (remainingGenerations <= 0) {
      toast.error('You have used all your generations. Please purchase more.');
      return;
    }
    if (!user) {
      highlightLogin.set(true);
      generateError = true;
      return;
    }
    if (!$blobImage) {
      highlightPhotoUpload.set(true);
      generateError = true;
      return;
    }
    if (!style) {
      highlightStyles.set(true);
      generateError = true;
      return;
    }
    if ($generationLoading) return;
    $generationLoading = true;
    await tick();
    window.plausible?.('GenerateImage');

    remainingGenerations--;
    try {
      generatedImageID.set('');
      var data = new FormData();
      data.append('image', $blobImage);
      data.append('style', style);

      const response = await fetch('/api/create-image', {
        method: 'POST',
        body: data
      });

      if (response.status !== 200) {
        remainingGenerations++;
        $generationLoading = false;

        if (response.status === 429) {
          toast.error('You have reached the limit of image generation. Please try again tomorrow');
        } else {
          toast.error('Error generating image');
        }
        return;
      }
      const id = ((await response.json()) as { id: string }).id;
      if (id) {
        generatedImageID.set(id);
      }
    } catch (error) {
      remainingGenerations++;
      $generationLoading = false;
      toast.error('Error generating image');
      console.error('Error generating image', error);
    }
  }

  function reset(e: MouseEvent) {
    e.preventDefault();
    dropZone?.reset();
    blobImage.set(null);
  }

  async function startCapture() {
    await tick();
    if (video) {
      cameraIsReady = false;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (video) {
          video.srcObject = stream;
          video.play();
          cameraIsReady = true;
        }
      } catch (err) {
        toast.error('Error accessing the camera');
        console.error('Error accessing the camera', err);
        capture = false;
      }
    }
  }

  function closeCameraPreview(e: MouseEvent) {
    stream?.getTracks().forEach((track) => track.stop());
    capture = false;
    e.preventDefault();
  }

  async function getImageFromVideo(video: HTMLVideoElement, quality = 0.8) {
    return new Promise<Blob | null>((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(resolve, 'image/png', quality);
    });
  }

  async function shoot(e: MouseEvent) {
    if (video && cameraIsReady) {
      try {
        blobImage.set(await getImageFromVideo(video));
      } catch (error) {
        toast.error('Error capturing image');
        console.error('Error capturing image', error);
      }

      closeCameraPreview(e);
      mouseOverDropZone = false;
      setTimeout(() => {
        mouseOverDropZone = false;
      }, 10);
    }
  }

  $effect(() => {
    if (capture) {
      startCapture();
    }
  });
</script>

<aside class="flex w-full flex-col pt-8 md:max-w-md">
  <div class="flex flex-col gap-4 px-4 pb-4">
    <div class="grid gap-2">
      <Label role="button" for="picture">Your photo</Label>
      <DropZone
        bind:this={dropZone}
        id="drop-photo"
        extenstions={['png', 'jpg', 'jpeg']}
        maxFileSize={1024}
        mediaType="image/*"
        fileChange={(file) => handleImageUpload(file)}
        onmouseenter={() => (mouseOverDropZone = true)}
        onmouseleave={() => (mouseOverDropZone = false)}
        disabled={!!$blobImage || capture}
      >
        {#snippet extraAction()}
          <div class="divider my-2 text-xs">or</div>

          <Tooltip.Provider>
            <Tooltip.Root bind:open={$highlightPhotoUpload}>
              <Tooltip.Trigger>
                {#snippet child({ props })}
                  <DaisyButton
                    {...props}
                    label="Take a photo"
                    icon="camera_alt"
                    size="sm"
                    outline
                    class="mx-auto"
                    onclick={() => (capture = true)}
                  />
                {/snippet}
              </Tooltip.Trigger>
              <Tooltip.Content warning>Please upload a photo</Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        {/snippet}
        {#if capture}
          <div
            class="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg bg-base-100"
          >
            {#if !cameraIsReady}
              <span class="loading loading-infinity loading-lg"></span>
            {/if}

            <video
              bind:this={video}
              class="absolute h-full w-full"
              autoplay
              playsinline
              onclick={shoot}
            >
              <track kind="captions" />
            </video>
            <DaisyButton
              icon="close"
              size="xs"
              circle
              variant="neutral"
              class="absolute right-1 top-1"
              onclick={closeCameraPreview}
            />
            <DaisyButton
              label="Capture"
              icon="camera_alt"
              size="xs"
              class="absolute bottom-2 right-2"
              onclick={shoot}
            />
          </div>
        {/if}
        {#if $previewImage}
          <div class="absolute inset-0 bg-base-100">
            <div
              class="absolute inset-0"
              out:fade={{ duration: 100 }}
              in:scale={{ duration: 300, opacity: 0.5, start: 0.9 }}
            >
              <DaisyButton
                icon="delete"
                size="xs"
                circle
                variant="neutral"
                class="absolute right-1 top-1"
                onclick={reset}
              />
              <img
                src={$previewImage}
                alt="Preview"
                class={cn(
                  'absolute h-full w-full origin-bottom-left translate-y-0 rotate-0 rounded-lg object-cover transition-all ',
                  {
                    'translate-y-8 -rotate-12 shadow-lg': mouseOverDropZone
                  }
                )}
              />
            </div>
          </div>
        {/if}
      </DropZone>
    </div>

    <Card.Root>
      <Card.Header>
        <Card.Title>
          <Tooltip.Provider>
            <Tooltip.Root bind:open={$highlightStyles}>
              <Tooltip.Trigger>Choose a style</Tooltip.Trigger>
              <Tooltip.Content warning>Please select a style</Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </Card.Title>
        <Card.Description>
          Choose a style for your photo. The style will be applied to your photo to make it look
          unique.
        </Card.Description>
      </Card.Header>
      <Card.Content class="grid gap-6">
        <RadioGroup.Root bind:value={style} class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {#each styles as style}
            <StyleItem name={style} />
          {/each}
        </RadioGroup.Root>
      </Card.Content>
    </Card.Root>
  </div>

  <Footer class="md:hidden" />
  <footer
    class="sticky bottom-0 flex flex-col justify-between gap-4 border-t border-neutral-content bg-base-100 p-4 md:flex-row"
  >
    <div class="flex w-full flex-col gap-4">
      {#if !user}
        <p class="text-center text-sm text-error">
          Please login to generate previews and buy credits
        </p>
      {/if}
      <div class="flex w-full gap-2">
        <DaisyButton
          iconSide="left"
          icon="bolt"
          size="md"
          class="flex-1"
          variant="neutral"
          onclick={generate}
          loading={$generationLoading && !!user}
          bind:error={generateError}
        >
          Generate <RollingDigits
            value={remainingGenerations}
            class="rounded-sm bg-black/10 px-1 dark:bg-white/15"
          />
        </DaisyButton>
        <DaisyButton
          iconSide="left"
          icon="shopping_cart"
          variant="neutral"
          size="md"
          class="flex-1"
          onclick={() => {
            if (!user) {
              highlightLogin.set(true);
              buyError = true;
              return;
            }
            askBuyDialog = true;
          }}
          bind:error={buyError}
        >
          Buy credits
        </DaisyButton>
      </div>
    </div>

    <Dialog.Root bind:open={askBuyDialog}>
      <Dialog.Content class="max-w-md overflow-auto">
        <Dialog.Header>
          <Dialog.Title>Buy more credits</Dialog.Title>
          <Dialog.Description>
            Get more credits to generate amazing AI avatars. Each credit allows you to generate one
            preview.
          </Dialog.Description>
        </Dialog.Header>
        <div class="flex flex-row justify-between">
          <DaisyButton
            size="sm"
            onclick={() => {
              askBuyDialog = false;
            }}>Cancel</DaisyButton
          >
          <DaisyButton variant="primary" size="sm" icon="sell" onclick={buyCredit}
            >Buy now
          </DaisyButton>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  </footer>

  <Dialog.Root bind:open={showStripe}>
    <Dialog.Content class="max-h-full max-w-[1100px] overflow-auto px-0 lg:max-h-[80%]">
      <div use:onShowStripe>
        <!-- Checkout will insert the payment form here -->
      </div>
    </Dialog.Content>
  </Dialog.Root>
</aside>
