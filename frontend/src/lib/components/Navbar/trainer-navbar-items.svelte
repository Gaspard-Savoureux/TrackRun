<script lang="ts">
    import Modal from '$lib/components/informative-modal.svelte';
    import { UserIcon, SettingsIcon } from 'svelte-feather-icons';
    import NavbarPages from './navbar-pages.svelte';
  </script>
  
  <div class="display-navbar">
    <NavbarPages />
    <hr />
  </div>
  
  <Modal info="Profile" href="/trainer/profile">
    <div class="nav-item">
      <UserIcon />
      <p>Profile</p>
    </div>
  </Modal>
  
  <!-- <Modal info="Settings" href="/settings"> -->
  <Modal info="Settings" href="/trainer/settings">
    <div class="nav-item">
      <SettingsIcon />
      <p>Settings</p>
    </div>
  </Modal>
  
  <hr class="display-navbar" />
  
  <style>
    .nav-item {
      padding: 1rem;
      color: var(--text);
      background-color: var(--bg-3);
      display: flex;
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
