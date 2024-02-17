<script lang="ts">
	import { blur, fade } from 'svelte/transition';
	import * as Card from '$lib/components/ui/card';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import StyleItem from './style-item.svelte';
	import DaisyButton from '$lib/components/daisy/daisy-button.svelte';
	import DropZone from '$lib/components/drop-zone.svelte';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';

	// https://github.com/InstantID/InstantID/blob/main/assets/0.png
	// https://github.com/ahgsql/StyleSelectorXL/blob/main/sdxl_styles.json

	let previewImage = '';
	let loading = false;
	let dropZone: DropZone | undefined;
	let capture = false;
	let cameraIsReady = false;
	let video: HTMLVideoElement | undefined;
	let mouseOverDropZone = false;

	function handleImageUpload(file?: File) {
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				previewImage = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function generateRandomStyle() {
		let styles = ['Line Art', 'Craft Clay', 'Analog Film', 'Origami', 'Psychedelic'];
		style = styles[Math.floor(Math.random() * styles.length)];

		generate();
	}

	async function generate() {
		if (!previewImage) {
			toast.warning('Please upload a photo');
			return;
		}
		if (!style) {
			toast.warning('Please select a style');
			return;
		}
		loading = true;
		await new Promise((resolve) => setTimeout(resolve, 1000));
		loading = false;
	}
	function reset(e: MouseEvent) {
		e.preventDefault();
		dropZone?.reset();
		previewImage = '';
	}

	let stream: MediaStream | undefined;
	let style = '';
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

	function shoot(e: MouseEvent) {
		if (video) {
			let canvas = document.createElement('canvas');
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
			previewImage = canvas.toDataURL('image/png');
			closeCameraPreview(e);
			setTimeout(() => {
				mouseOverDropZone = false;
			}, 10);
		}
	}

	$: if (capture) {
		console.log('startCapture');
		startCapture();
	}
</script>

<aside class="flex w-full max-w-xs flex-col pt-8">
	<div class="flex flex-col gap-4 px-4 pb-4">
		<div class="grid gap-2">
			<Label role="button" for="picture">Your photo</Label>
			<DropZone
				bind:this={dropZone}
				id="drop-photo"
				extenstions={['png', 'jpg', 'jpeg']}
				maxFileSize={1024}
				mediaType="image/*"
				on:fileChange={(e) => handleImageUpload(e.detail)}
				on:mouseenter={() => (mouseOverDropZone = true)}
				on:mouseleave={() => (mouseOverDropZone = false)}
				disabled={!!previewImage || capture}
			>
				<svelte:fragment slot="extraAction">
					<div class="divider my-2 text-xs">or</div>
					<DaisyButton
						label="Take a photo"
						icon="camera_alt"
						size="sm"
						outline
						class="mx-auto"
						on:click={() => (capture = true)}
					/>
				</svelte:fragment>
				{#if capture}
					<div
						class="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg bg-base-100"
					>
						{#if !cameraIsReady}
							<span class="loading loading-infinity loading-md"></span>
						{/if}

						<video bind:this={video} class="absolute h-full w-full" autoplay on:click={shoot}>
							<track kind="captions" />
						</video>
						<DaisyButton
							icon="close"
							size="xs"
							circle
							variant="neutral"
							class="absolute right-1 top-1"
							on:click={closeCameraPreview}
						/>
						<DaisyButton
							label="Capture"
							icon="camera_alt"
							size="xs"
							class="absolute bottom-2 right-2"
							on:click={shoot}
						/>
					</div>
				{/if}
				{#if previewImage}
					<div class="absolute inset-0" out:fade={{ duration: 100 }} in:blur={{ duration: 300 }}>
						<DaisyButton
							icon="delete"
							size="xs"
							circle
							variant="neutral"
							class="absolute right-1 top-1"
							on:click={reset}
						/>
						<img
							src={previewImage}
							alt="Preview"
							class={cn(
								'absolute h-full w-full origin-bottom-left translate-y-0 rotate-0 rounded-lg object-cover transition-all ',
								{
									'translate-y-8 -rotate-12 shadow-lg': mouseOverDropZone
								}
							)}
						/>
					</div>
				{/if}
			</DropZone>
		</div>

		<Card.Root>
			<Card.Header>
				<Card.Title>Choose a style</Card.Title>
				<Card.Description>
					Choose a style for your photo. The style will be applied to your photo to make it look
					unique.
				</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-6">
				<RadioGroup.Root bind:value={style} class="grid grid-cols-2 gap-4">
					<StyleItem label="Line Art" id={1} />
					<StyleItem label="Craft Clay" id={2} />
					<StyleItem label="Analog Film" id={3} />
					<StyleItem label="Origami" id={4} />
					<StyleItem label="Psychedelic" id={5} />
					<StyleItem label="Psychedelic" id={6} />
				</RadioGroup.Root>
			</Card.Content>
		</Card.Root>
	</div>
	<footer
		class="sticky bottom-0 flex flex-row justify-between border-t border-neutral-content bg-base-100 p-4"
	>
		<DaisyButton label="Surprise me" icon="sync" size="md" on:click={generate} {loading} />
		<DaisyButton
			label="Generate"
			icon="bolt"
			size="md"
			variant="neutral"
			on:click={generate}
			{loading}
		/>
	</footer>
</aside>
