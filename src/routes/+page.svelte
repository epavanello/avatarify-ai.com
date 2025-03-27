<script>
  import Meta from '$lib/SEO/meta.svelte';
  import Board from './board.svelte';
  import Sidebar from './sidebar.svelte';

  let { data } = $props();

  const { images, remainingGenerations } = $derived(data);
</script>

<Meta
  title="Create Custom AI Avatars"
  description="Transform your photos into stunning AI avatars with multiple styles including Studio Ghibli. Create personalized avatars with our advanced AI technology."
  keywords={[
    'Avatarify AI',
    'custom avatars',
    'AI avatar generator',
    'Studio Ghibli avatars',
    'anime avatars',
    'AI profile pictures',
    'stable diffusion',
    'personalized avatars',
    'AI art generator',
    'digital avatars',
    'AI image generation',
    'profile picture generator',
    'custom AI portraits',
    'anime style avatars',
    'AI art styles'
  ]}
  author="EmaDev"
/>
<Board user={data.user} {images} />
<Sidebar user={data.user} {remainingGenerations} />
