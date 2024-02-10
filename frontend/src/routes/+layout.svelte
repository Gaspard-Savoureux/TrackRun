<script lang="ts">
  import type { LayoutServerData } from './$types';
  import type { Theme } from '$lib/types/theme';
  import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
  import { theme } from '$lib/stores/theme';

  export let data: LayoutServerData;

  theme.set(data.theme as Theme);
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme === 'system' ? 'light dark' : $theme}/>
  <link rel="stylesheet" href={`/themes/${$theme}.css`} />
</svelte:head>

<ThemeSwitcher />
<slot />
