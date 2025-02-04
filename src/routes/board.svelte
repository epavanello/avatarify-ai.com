<script lang="ts">
  import { generatedImageID, generationLoading } from './store';
  import { cn } from '$lib/utils';
  import DaisyButton from '$lib/components/daisy/daisy-button.svelte';
  import { PUBLIC_WEBSITE_HOST } from '$env/static/public';
  import { fade } from 'svelte/transition';
  import Typewriter from 'svelte-typewriter';
  import { breakpoint } from '$lib/breakpoints';
  import Footer from '$lib/components/footer.svelte';
  import type { User } from '@supabase/supabase-js';
  import { tick } from 'svelte';
  import { invalidate } from '$app/navigation';
  import Icon from '$lib/icon.svelte';

  interface Props {
    user: User | null;
    images: { id: string; url: string }[];
  }

  let { user, images }: Props = $props();
  let selectedImageId = $state('');
  let isLogged = $derived(!!user);
  let hasUsableImageID = $derived(!!$generatedImageID && isLogged);

  let board: HTMLElement | undefined = $state();

  let randomId = $state(Math.random().toString(36).substring(7));

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

  let motivationalMessage = $state('');

  function getRandomMotivationalMessage(): string {
    let message = '';
    do {
      message = motivationalsMessages[Math.floor(Math.random() * motivationalsMessages.length)];
    } while (message === motivationalMessage);
    return message;
  }

  motivationalMessage = getRandomMotivationalMessage();

  function getImageUrl() {
    if (selectedImageId) {
      const image = images.find((img) => img.id === selectedImageId);
      if (!image) {
        throw new Error('Image not found');
      }
      return image.url;
    }
    return `${PUBLIC_WEBSITE_HOST}/api/get-image/${$generatedImageID}?_=${randomId}`;
  }

  async function download() {
    const imageUrl = getImageUrl();
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-image.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  async function deleteImage(id: string) {
    try {
      const response = await fetch(`/api/delete-image/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        images = images.filter((img) => img.id !== id);

        await invalidate('app:images');
        if (selectedImageId === id) {
          selectedImageId = '';
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  let interval: ReturnType<typeof setInterval>;
  generatedImageID.subscribe(async (value) => {
    if (value) {
      $generationLoading = true;
      selectedImageId = '';
      if ($breakpoint.mobile) {
        await tick();
        board?.scrollIntoView({ behavior: 'smooth' });
      }

      // on each new image, check if the image is ready to download
      if (interval) clearInterval(interval);

      interval = setInterval(async () => {
        motivationalMessage = getRandomMotivationalMessage();
        const checkResult = await fetch(`/api/get-image/${value}`);
        if (checkResult.ok) {
          await invalidate('app:images');

          randomId = Math.random().toString(36).substring(7);
          generatedImageID.set('');
          selectedImageId = value;

          window.plausible?.('ImageGenerated');
          clearInterval(interval);
        }
      }, 5000);
    } else {
      $generationLoading = false;
    }
  });

  function onImageLoad() {
    console.log('image loaded');
    $generationLoading = false;
  }
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
      <!-- svelte-ignore a11y_img_redundant_alt -->
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
      <!-- svelte-ignore a11y_img_redundant_alt -->
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
    {#if selectedImageId}
      <img
        src={images.find((img) => img.id === selectedImageId)?.url}
        alt="Selected"
        class="absolute h-full w-full origin-bottom-left translate-y-0 rotate-0 rounded-lg object-cover opacity-100 transition-all"
        crossorigin="anonymous"
        in:fade={{ duration: 300 }}
      />
    {:else if $generationLoading && hasUsableImageID}
      {#if $generatedImageID}
        <img
          src={`${PUBLIC_WEBSITE_HOST}/api/get-image/${$generatedImageID}?_=${randomId}`}
          alt="Generated"
          class={cn(
            'absolute h-full w-full origin-bottom-left translate-y-0 rotate-0 rounded-lg object-cover opacity-0 transition-all'
          )}
          crossorigin="anonymous"
          in:fade={{ duration: 300 }}
          onload={onImageLoad}
        />
      {/if}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_interactive_supports_focus -->
      <div
        class="pointer-events-auto absolute inset-0 cursor-default"
        role="button"
        onclick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      ></div>
    {/if}
    {#if $generationLoading || !hasUsableImageID}
      <p class="px-8 text-center text-2xl font-bold text-neutral-content">
        {#if $generationLoading && hasUsableImageID}
          Be patient, we are generating your photo...
        {:else}
          The generated photo will appear here
        {/if}
      </p>

      {#if $generationLoading && hasUsableImageID}
        <Typewriter>
          <p class="px-8 text-center font-mono text-lg font-semibold text-neutral-content">
            {motivationalMessage}
          </p>
        </Typewriter>
      {/if}
    {/if}
  </div>

  {#if selectedImageId || (!$generationLoading && hasUsableImageID)}
    <DaisyButton variant="neutral" icon="download" onclick={download}>Download</DaisyButton>
  {/if}

  {#if user}
    <div class="carousel carousel-center mt-4 max-w-xl space-x-4 rounded-box bg-neutral p-4">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      {#if $generatedImageID && $generationLoading}
        <!-- Placeholder for generating image -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="carousel-item cursor-pointer"
          onclick={() => {
            selectedImageId = '';
          }}
        >
          <div class="flex h-32 w-32 items-center justify-center rounded-box bg-base-100">
            {#if $generationLoading}
              <span class="loading loading-infinity loading-lg"></span>
            {/if}
          </div>
        </div>
      {/if}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      {#each images as image}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="carousel-item relative">
          <div
            class="cursor-pointer"
            onclick={() => {
              selectedImageId = image.id;
            }}
          >
            <img
              src={image.url}
              alt="Generated"
              class={cn('h-32 w-32 rounded-box object-cover', {
                'ring-4 ring-primary': selectedImageId === image.id
              })}
            />
          </div>
          <DaisyButton
            class="absolute -right-2 -top-2"
            circle
            icon="close"
            size="xs"
            onclick={(e) => {
              deleteImage(image.id);
              e.stopPropagation();
            }}
          />
        </div>
      {/each}
    </div>
  {/if}

  <Footer class="absolute hidden md:block" />
</section>
