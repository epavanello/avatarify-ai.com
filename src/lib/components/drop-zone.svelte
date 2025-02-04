<script lang="ts">
  import Icon from '$lib/icon.svelte';
  import { cn } from '$lib/utils';
  import { type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    id?: string | undefined;
    extenstions: string[];
    maxFileSize?: number;
    mediaType?: 'image/*' | 'video/*' | 'audio/*';
    disabled?: boolean;
    extraAction?: Snippet;
    children?: Snippet;
    fileChange?: (file: File | undefined) => void;
  } & HTMLAttributes<HTMLLabelElement>;

  let {
    id = undefined,
    extenstions = [],
    maxFileSize = undefined,
    mediaType = undefined,
    disabled = false,
    class: classes = undefined,
    extraAction,
    children,
    fileChange,
    ...rest
  }: Props = $props();

  let accept = $derived([mediaType, ...extenstions.map((e) => `.${e}`)].filter(Boolean).join(','));

  function handleFileChange(file?: File) {
    fileChange?.(file);
  }

  let file: HTMLInputElement | undefined = $state();
  export function reset() {
    if (file) {
      file.value = '';
    }
  }
</script>

<label
  for={id}
  class={cn(
    'photos-border relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600',
    { 'cursor-default': disabled },
    classes
  )}
  ondrop={(e) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer?.files[0]);
  }}
  {...rest}
>
  <div class="flex flex-col items-center justify-center pb-6 pt-5">
    <Icon name="cloud_upload" size="lg" class="mb-3 text-base-content" />
    <p class="text-sm text-base-content">
      <span class="font-semibold">Click to upload</span> or drag and drop
    </p>
    {@render extraAction?.()}
    <p class="absolute bottom-2 text-xs text-base-content">
      {#if extenstions.length === 1}
        {extenstions[0]} file only
      {:else if extenstions.length > 1}
        {extenstions.map((e) => `.${e}`).join(', ')} files only
      {/if}
      {#if extenstions.length > 0 && maxFileSize}
        -
      {/if}
      {#if maxFileSize}
        up to {maxFileSize / 1024}MB
      {/if}
    </p>
  </div>
  <input
    bind:this={file}
    {id}
    type="file"
    class="hidden"
    {accept}
    {disabled}
    oninput={(e) => {
      handleFileChange(e.currentTarget.files?.[0]);
    }}
  />
  {@render children?.()}
</label>
