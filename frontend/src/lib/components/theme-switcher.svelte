<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import { SunIcon, MoonIcon, BoxIcon } from 'svelte-feather-icons';
  import { Theme } from '$lib/types/theme';

  const themeValues = Object.values(Theme);
  let index = themeValues.indexOf($theme);
  const toggleTheme = () => {
    index = (index + 1) % themeValues.length;
    $theme = themeValues[index];
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
    background-color: inherit;
    align-self: center;
    padding: 1rem;
    border: none;
  }

  @media (max-width: 576px) {
    button {
      padding-right: 100%;
      margin-right: -86%;
    }
  }
</style>
