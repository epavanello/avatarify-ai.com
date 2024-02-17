<script lang="ts">
	import Icon from '$lib/icon.svelte';
	import { cn } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = {
		id?: string | undefined;
		extenstions: string[];
		maxFileSize?: number;
		mediaType?: 'image/*' | 'video/*' | 'audio/*';
		disabled?: boolean;
	} & HTMLAttributes<HTMLLabelElement>;

	export let id: $$Props['id'] = undefined;
	export let extenstions: $$Props['extenstions'] = [];
	export let maxFileSize: $$Props['maxFileSize'] = undefined;
	export let mediaType: $$Props['mediaType'] = undefined;
	export let disabled: $$Props['disabled'] = false;
	let classes: $$Props['class'] = undefined;
	export { classes as class };

	$: accept = [mediaType, ...extenstions.map((e) => `.${e}`)].filter(Boolean).join(',');

	const dispatch = createEventDispatcher<{ fileChange: File | undefined }>();

	function handleFileChange(file?: File) {
		dispatch('fileChange', file);
	}

	let file: HTMLInputElement | undefined;
	export function reset() {
		if (file) {
			file.value = '';
		}
	}
</script>

<label
	on:mouseenter
	on:mouseleave
	for={id}
	class={cn(
		'photos-border relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600',
		{ 'cursor-default': disabled },
		classes
	)}
	on:drop={(e) => {
		e.preventDefault();
		handleFileChange(e.dataTransfer?.files[0]);
	}}
	{...$$restProps}
>
	<div class="flex flex-col items-center justify-center pb-6 pt-5">
		<Icon name="cloud_upload" size="lg" class="mb-3 text-base-content" />
		<p class="text-sm text-base-content">
			<span class="font-semibold">Click to upload</span> or drag and drop
		</p>
		<slot name="extraAction" />
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
		on:input={(e) => {
			handleFileChange(e.currentTarget.files?.[0]);
		}}
	/>
	<slot />
</label>
