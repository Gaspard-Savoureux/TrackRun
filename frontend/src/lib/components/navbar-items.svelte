<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import Modal from '$lib/components/informative-modal.svelte';
  import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
  import { UserIcon, SettingsIcon, ActivityIcon } from 'svelte-feather-icons';

  export let isSmallScreen = false;
</script>

{#if isSmallScreen}
  <Modal info="Activities" href="/activities">
    <div class="nav-item">
      <ActivityIcon />
      <p class:isSmallScreen>Activities</p>
    </div>
  </Modal>
  <hr />
{/if}

<Modal info="Profile" href="/profile">
  <div class="nav-item">
    <UserIcon />
    <p class:isSmallScreen>Profile</p>
  </div>
</Modal>
<Modal info={`Theme: ${$theme}`}>
  <div class="switcher">
    <ThemeSwitcher />
    <p class:isSmallScreen>Theme</p>
  </div>
</Modal>
<Modal info="Settings" href="/settings">
  <div class="nav-item">
    <SettingsIcon />
    <p class:isSmallScreen>Settings</p>
  </div>
</Modal>

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
    display: flex;
  }

  .switcher {
    display: flex;
    align-items: center;
    color: var(--text);
  }

  .switcher > p {
    margin-left: 0rem;
  }

  .nav-item:hover,
  .switcher:hover {
    background-color: var(--blue);
  }

  p {
    visibility: hidden;
    position: absolute;
    margin: 0;
  }

  .isSmallScreen {
    visibility: visible;
    position: relative;
    margin-left: 1rem;
  }
</style>
