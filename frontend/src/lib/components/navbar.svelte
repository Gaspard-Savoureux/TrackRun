<script lang="ts">
  import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
  import { theme } from '$lib/stores/theme';
  import Modal from '$lib/components/informative-modal.svelte';

  // https://svelte-feathers.codewithshin.com/
  // https://feathericons.com/
  import { HomeIcon, LogOutIcon, UserIcon } from 'svelte-feather-icons';
</script>

<div class="navbar">
  <Modal info="Home" href="/">
    <div class="nav-item"><HomeIcon /></div>
  </Modal>
  <div class="pages-icon">
    <Modal info={`Theme: ${$theme}`}>
      <div class="switcher"><ThemeSwitcher /></div>
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
    padding: 1rem;
    color: var(--text);
    display: flex;
  }

  .nav-item:hover,
  .switcher:hover {
    background-color: var(--blue);
  }
</style>
