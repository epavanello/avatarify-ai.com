<script lang="ts">
  import { cn } from '$lib/utils';

  export type SocialAvatarProps = {
    profile: string;
    provider:
      | 'deviantart'
      | 'dribbble'
      | 'duckduckgo'
      | 'github'
      | 'google'
      | 'gravatar'
      | 'instagram'
      | 'microlink'
      | 'readcv'
      | 'reddit'
      | 'soundcloud'
      | 'substack'
      | 'telegram'
      | 'twitter'
      | 'x'
      | 'twitch'
      | 'youtube';
  };

  const { profile, provider, size = 'lg' }: SocialAvatarProps & { size?: 'sm' | 'lg' } = $props();
</script>

<img
  src="https://unavatar.io/{provider}/{profile}"
  alt={profile}
  class={cn('aspect-square rounded-full border-2 border-border/75', {
    'h-16': size === 'lg',
    'h-8': size === 'sm'
  })}
/>
