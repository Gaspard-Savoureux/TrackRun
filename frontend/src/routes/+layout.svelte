<script lang="ts">
  import type { LayoutServerData } from './$types';
  import { Theme } from '$lib/types/theme';
  import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
  import { theme } from '$lib/stores/theme';

  // https://svelte-feathers.codewithshin.com/
  //https://feathericons.com/
  import {
    HomeIcon,
    LogInIcon,
    LogOutIcon,
    UserIcon,
  } from 'svelte-feather-icons';

  export let data: LayoutServerData;

  theme.set(data.theme);

  const loggedIn = false; // A implementer proprement
</script>

<svelte:head>
  <meta
    name="color-scheme"
    content={$theme === Theme.System ? 'light dark' : $theme}
  />
  <link rel="stylesheet" href={`/themes/${$theme}.css`} />
</svelte:head>

<div class="navbar">
  <ThemeSwitcher />
  <a href="/"><div class="nav-item"><HomeIcon /></div></a>
  {#if loggedIn}
    <a href="/infos"><div class="nav-item"><UserIcon /></div></a>
    <div class="nav-item"><LogOutIcon /></div>
  {:else}
    <a href="/login"><div class="nav-item"><LogInIcon /></div></a>
  {/if}
</div>

<!-- TODO ADD CURRENTLY NAVIGATING https://learn.svelte.dev/tutorial/navigating-store -->
<slot />

<style>
  .navbar {
    background-color: var(--bg-3);
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: stretch;
  }

  .nav-item {
    margin-right: 1rem;
    padding: 1rem;
    color: var(--text)
    /* background-color: aqua; */
    /* flex-wrap: 5; */
  }

  .nav-item:hover {
    background-color: var(--blue);
  }

  /* .navbar > select {
    position: fixed;
    align-self: flex-start;
    background-color: aliceblue;
    padding: 2rem;
  }  */
</style>
