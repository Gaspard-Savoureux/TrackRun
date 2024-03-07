<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import { SunIcon, MoonIcon, BoxIcon } from 'svelte-feather-icons';
  import { Theme } from '$lib/types/theme';

  const themes_values = Object.values(Theme);
  let index = 0;
  const toggleTheme = () => {
    index = (index + 1) % 3;
    $theme = themes_values[index];
    document.cookie = `theme=${$theme}; path=/; SameSite=Lax`;
  };
</script>

<button on:click={toggleTheme}>
  {#if $theme === Theme.System}
    <BoxIcon />
  {:else if $theme === Theme.Dark}
    <MoonIcon />
  {:else if $theme === Theme.Light}
    <SunIcon />
  {/if}
</button>

<style>
  button {
    align-items: center;
    border: none;
    background-color: inherit;
  }
</style>
