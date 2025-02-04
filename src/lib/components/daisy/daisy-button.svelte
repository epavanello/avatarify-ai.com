<script lang="ts">
  import type { Icons } from '$lib/icon.svelte';
  import Icon from '$lib/icon.svelte';
  import { cn } from '$lib/utils';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = {
    label?: string;
    /**
     * Search on: https://fonts.google.com/icons
     */
    icon?: Icons;
    iconLeft?: Snippet;
    iconRight?: Snippet;
    iconSide?: 'left' | 'right';
    loading?: boolean;
    circle?: boolean;
    outline?: boolean;
    ghost?: boolean;
    variant?: 'default' | 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    error?: boolean;
    children?: Snippet;
  } & HTMLButtonAttributes;

  let {
    label,
    icon,
    iconLeft,
    iconRight,
    iconSide = 'right',
    loading = false,
    circle = false,
    outline = false,
    ghost = false,
    variant = 'default',
    size = 'md',
    error = $bindable(false),
    class: classes,
    children,
    ...rest
  }: Props = $props();

  $effect(() => {
    if (error) {
      setTimeout(() => {
        error = false;
      }, 500);
    }
  });
</script>

<button
  class={cn(
    'btn',
    {
      'btn-xs': size === 'xs',
      'btn-sm': size === 'sm',
      'btn-md': size === 'md',
      'btn-lg': size === 'lg'
    },
    { 'btn-circle': circle, 'btn-outline': outline, 'btn-ghost': ghost },
    {
      '': variant === 'default',
      'btn-neutral': variant === 'neutral',
      'btn-primary': variant === 'primary',
      'btn-secondary': variant === 'secondary',
      'btn-success': variant === 'success',
      'btn-warning': variant === 'warning',
      'btn-error': variant === 'error'
    },
    classes,
    { error: error }
  )}
  disabled={loading}
  {...rest}
>
  {@render iconLeft?.()}
  {#if icon && iconSide === 'left' && !loading}
    <Icon name={icon} {size} />
  {/if}

  {#if loading && iconSide === 'left'}
    <span
      class={cn('loading loading-spinner aspect-square p-1', {
        'w-3': size === 'xs',
        'w-4': size === 'sm',
        'w-5': size === 'md',
        'w-6': size === 'lg'
      })}
    ></span>
  {/if}
  {#if children}
    {@render children?.()}
  {:else if label}
    {label}
  {/if}
  {@render iconRight?.()}
  {#if icon && iconSide === 'right' && !loading}
    <Icon name={icon} {size} />
  {/if}

  {#if loading && iconSide === 'right'}
    <span
      class={cn('loading loading-spinner aspect-square p-1', {
        'w-3': size === 'xs',
        'w-4': size === 'sm',
        'w-5': size === 'md',
        'w-6': size === 'lg'
      })}
    ></span>
  {/if}
</button>

<style>
  .btn {
    animation: none;
  }
  .error {
    animation: shake 0.3s linear;
    animation-delay: 0.2s;
  }

  @keyframes shake {
    0% {
      transform: translate(16px);
    }
    20% {
      transform: translate(-16px);
    }
    40% {
      transform: translate(8px);
    }
    60% {
      transform: translate(-8px);
    }
    80% {
      transform: translate(4px);
    }
    100% {
      transform: translate(0px);
    }
  }
</style>
