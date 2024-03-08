<script lang="ts">
  import type { LayoutServerData } from './$types';
  import { Theme } from '$lib/types/theme';
  import { theme } from '$lib/stores/theme';
  import Navbar from '$lib/components/navbar.svelte';
  import { page } from '$app/stores';

  export let data: LayoutServerData;

  theme.set(data.theme);
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme === Theme.System ? 'light dark' : $theme} />
  <link rel="stylesheet" href={`/themes/${$theme}.css`} />
</svelte:head>

{#if $page.url.pathname !== '/login'}
  <Navbar />
{/if}

<slot />
