<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import Modal from '$lib/components/informative-modal.svelte';
  import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
  import { LogOutIcon, UserIcon, SettingsIcon, ActivityIcon } from 'svelte-feather-icons';
</script>

<Modal info={`Theme: ${$theme}`}>
  <div class="switcher">
    <ThemeSwitcher />
  </div>
</Modal>
<Modal info="Profile" href="/profile">
  <div class="nav-item">
    <UserIcon />
  </div>
</Modal>
<Modal info="Activities" href="/activities">
  <div class="nav-item">
    <ActivityIcon />
  </div>
</Modal>
<Modal info="Settings" href="/settings">
  <div class="nav-item">
    <SettingsIcon />
  </div>
</Modal>
<Modal info="Logout" href="/logout">
  <div class="nav-item">
    <LogOutIcon />
  </div>
</Modal>

<style>
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
