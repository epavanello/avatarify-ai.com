<script lang="ts">
  import type { Icons } from '$lib/icon.svelte';
  import Icon from '$lib/icon.svelte';
  import { cn } from '$lib/utils';
  import { builderActions, getAttrs, type Builder } from 'bits-ui';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type $$Props = {
    label?: string;
    /**
     * Search on: https://fonts.google.com/icons
     */
    icon?: Icons;
    iconSide?: 'left' | 'right';
    loading?: boolean;
    circle?: boolean;
    outline?: boolean;
    ghost?: boolean;
    variant?: 'default' | 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    builders?: Builder[];
    error?: boolean;
  } & HTMLButtonAttributes;

  export let label: $$Props['label'] = undefined;
  export let icon: $$Props['icon'] = undefined;
  export let iconSide: $$Props['iconSide'] = 'right';
  export let loading: $$Props['loading'] = false;
  export let circle: $$Props['circle'] = false;
  export let outline: $$Props['outline'] = false;
  export let ghost: $$Props['ghost'] = false;
  export let variant: $$Props['variant'] = 'default';
  export let size: $$Props['size'] = 'md';
  export let builders: $$Props['builders'] = undefined;
  export let error: $$Props['error'] = false;
  let classes: $$Props['class'] = undefined;
  export { classes as class };

  $: if (error) {
    setTimeout(() => {
      error = false;
    }, 500);
  }
</script>

<button
  use:builderActions={{ builders: builders || [] }}
  {...getAttrs(builders || [])}
  on:click
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
  {...$$restProps}
>
  <slot name="icon-left">
    {#if icon && iconSide === 'left' && !loading}
      <Icon name={icon} {size} />
    {/if}
  </slot>
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
  {#if $$slots.default}
    <slot />
  {:else if label}
    {label}
  {/if}
  <slot name="icon-right">
    {#if icon && iconSide === 'right' && !loading}
      <Icon name={icon} {size} />
    {/if}
  </slot>
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
