<script lang="ts">
  import type { LayoutServerData } from './$types';
  import { Theme } from '$lib/types/theme';
  import { theme } from '$lib/stores/theme';
  import Navbar from '$lib/components/Navbar/navbar.svelte';
  import { page } from '$app/stores';

  export let data: LayoutServerData;

  theme.set(data.theme);
  const noNavPage = ['/login', '/register'];
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme === Theme.System ? 'light dark' : $theme} />
  <link rel="stylesheet" href={`/themes/${$theme}.css`} />
</svelte:head>

{#if !noNavPage.find((url) => url === $page.url.pathname)}
  <Navbar />
{/if}

<slot />

<style>
  @media (max-width: 576px) {
    :global(html, body) {
      overflow-x: hidden;
    }
  }
</style>
