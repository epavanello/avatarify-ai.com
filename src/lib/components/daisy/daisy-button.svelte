<script lang="ts">
	import type { Icons } from '$lib/icon.svelte';
	import Icon from '$lib/icon.svelte';
	import { cn } from '$lib/utils';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type $$Props = {
		label?: string;
		/**
		 * Search on: https://fonts.google.com/icons
		 */
		icon?: Icons;
		loading?: boolean;
		circle?: boolean;
		outline?: boolean;
		ghost?: boolean;
		variant?: 'default' | 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
		size?: 'xs' | 'sm' | 'md' | 'lg';
	} & HTMLButtonAttributes;

	export let label: $$Props['label'] = undefined;
	export let icon: $$Props['icon'] = undefined;
	export let loading: $$Props['loading'] = false;
	export let circle: $$Props['circle'] = false;
	export let outline: $$Props['outline'] = false;
	export let ghost: $$Props['ghost'] = false;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'md';
	let classes: $$Props['class'] = undefined;
	export { classes as class };
</script>

<button
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
		classes
	)}
	disabled={loading}
	{...$$restProps}
>
	{#if $$slots.default}
		<slot />
	{:else if label}
		{label}
	{/if}
	{#if icon && !loading}
		<Icon name={icon} {size} />
	{/if}
	{#if loading}
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
