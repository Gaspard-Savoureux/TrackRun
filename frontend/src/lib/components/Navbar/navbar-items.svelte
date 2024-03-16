<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import Modal from '$lib/components/informative-modal.svelte';
  import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
  import { UserIcon, SettingsIcon } from 'svelte-feather-icons';
  import NavbarPages from './navbar-pages.svelte';
</script>

<div class="display-navbar">
  <NavbarPages />
  <hr />
</div>

<Modal info="Profile" href="/profile">
  <div class="nav-item">
    <UserIcon />
    <p>Profile</p>
  </div>
</Modal>

<Modal info="Settings" href="/settings">
  <div class="nav-item">
    <SettingsIcon />
    <p>Settings</p>
  </div>
</Modal>

<hr class="display-navbar" />

<!-- <div> -->
<Modal info={`Theme: ${$theme}`}>
  <div class="switcher">
    <ThemeSwitcher />
    <p>Theme</p>
  </div>
</Modal>

<!-- </div> -->

<!-- 
Le logout sera déplacer dans les settings

<Modal info="Logout" href="/logout">
  <div class="nav-item">
    <LogOutIcon />
    <p class:isSmallScreen>Logout</p>
  </div>
</Modal> -->

<style>
  .nav-item {
    padding: 1rem;
    color: var(--text);
    background-color: var(--bg-3);
    display: flex;
  }

  .switcher {
    align-items: center;
    color: var(--text);
    display: flex;
  }

  .switcher > p {
    margin-left: 0rem;
    pointer-events: none;
  }

  p {
    display: none;
  }

  .display-navbar {
    display: none;
  }

  @media (max-width: 576px) {
    p {
      display: block;
      margin-left: 1rem;
    }

    .display-navbar {
      display: block;
    }
  }
</style>
