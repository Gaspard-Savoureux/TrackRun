<script lang="ts">
  import type { LayoutServerData } from './$types';
  import { Theme } from '$lib/types/theme';
  import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
  import { theme } from '$lib/stores/theme';
  import Modal from '$lib/components/informative-modal.svelte';

  // https://svelte-feathers.codewithshin.com/
  // https://feathericons.com/
  import { HomeIcon, LogOutIcon, UserIcon } from 'svelte-feather-icons';

  export let data: LayoutServerData;

  theme.set(data.theme);

  let modal: HTMLDialogElement;
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme === Theme.System ? 'light dark' : $theme} />
  <link rel="stylesheet" href={`/themes/${$theme}.css`} />
</svelte:head>

<div class="navbar">
  <dialog bind:this={modal}>lol</dialog>

  <Modal info="Home" href="/">
    <div class="nav-item"><HomeIcon /></div>
  </Modal>
  <div class="pages-icon">
    <Modal info={`Theme: ${$theme}`}>
      <div class="nav-item"><ThemeSwitcher /></div>
    </Modal>
    <Modal info="Profile" href="/profile">
      <div class="nav-item"><UserIcon /></div>
    </Modal>
    <Modal info="Logout" href="/logout">
      <div class="nav-item">
        <LogOutIcon />
      </div>
    </Modal>
  </div>
</div>

<slot />

<style>
  .navbar {
    background-color: var(--bg-3);
    display: flex;
    justify-content: space-between;
  }

  .pages-icon {
    background-color: var(--bg-3);
    display: flex;
  }

  .nav-item {
    margin-right: 1rem;
    padding: 1rem;
    color: var(--text);
  }

  .nav-item:hover {
    background-color: var(--blue);
  }
</style>
