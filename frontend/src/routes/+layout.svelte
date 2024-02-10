<script lang="ts">
  import type { LayoutServerData } from './$types';
  import { Theme } from '$lib/types/theme';
  import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
  import { theme } from '$lib/stores/theme';

  export let data: LayoutServerData;

  theme.set(data.theme);
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme === Theme.System ? 'light dark' : $theme}/>
  <link rel="stylesheet" href={`/themes/${$theme}.css`} />
</svelte:head>

<ThemeSwitcher />
<slot />
