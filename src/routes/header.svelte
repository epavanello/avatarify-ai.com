<script lang="ts">
  import Icon from '$lib/icon.svelte';
  import DaisyButton from '$lib/components/daisy/daisy-button.svelte';
  import Google from '$lib/svg/google.svelte';
  import type { User, SupabaseClient } from '@supabase/supabase-js';
  import { PUBLIC_WEBSITE_HOST } from '$env/static/public';
  import { highlightLogin } from './store';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { breakpoint } from '$lib/breakpoints';

  interface Props {
    supabase: SupabaseClient;
    user: User | null;
  }

  let { supabase, user }: Props = $props();

  function toggleTheme(dark: boolean) {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', dark);
  }
</script>

<header class="flex items-center justify-start gap-8 border-b border-neutral-content p-4">
  <h1 class="text-2xl font-bold">
    <a href="/">AvatarifyAI</a>
  </h1>
  <a href="/blog" class="hidden text-lg hover:text-primary md:block">Blog</a>
  <div class="flex-1"></div>
  <div class="flex space-x-4">
    <label class="swap swap-rotate">
      <!-- this hidden checkbox controls the state -->
      <input
        type="checkbox"
        class="theme-controller"
        value="synthwave"
        onchange={(e) => {
          toggleTheme(e.currentTarget.checked);
        }}
      />

      <!-- sun icon -->
      <Icon name="light_mode" class="swap-on" size="lg" />
      <!-- moon icon -->
      <Icon name="dark_mode" class="swap-off" size="lg" />
    </label>

    {#if !user}
      <Tooltip.Provider>
        <Tooltip.Root bind:open={$highlightLogin}>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <DaisyButton
                {...props}
                size="sm"
                variant="neutral"
                onclick={() => {
                  supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: `${PUBLIC_WEBSITE_HOST}/auth/callback`
                    }
                  });
                }}
              >
                {$breakpoint.mobile ? 'Login' : 'Login with Google'}
                {#snippet iconLeft()}
                  <Google />
                {/snippet}
              </DaisyButton>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content warning class="mr-8">Please login to generate an avatar</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    {:else}
      <DaisyButton
        size="sm"
        variant="neutral"
        icon="logout"
        iconSide="left"
        onclick={async () => {
          await supabase.auth.signOut();
        }}
      >
        Sign out
      </DaisyButton>
    {/if}
  </div>
</header>
