<script lang="ts">
  import Modal from '$lib/components/informative-modal.svelte';
  import NavbarItems from './user-navbar-items.svelte';
  import { HomeIcon } from 'svelte-feather-icons';
  import Navburger from './navburger.svelte';
  import NavbarPages from './navbar-pages.svelte';
</script>

<div class="navbar">
  <div style="display: flex;">
    <Modal info="Home" href="/">
      <div class="nav-item">
        <HomeIcon />
      </div>
    </Modal>
  </div>

  <div class="pages-icon">
    <NavbarPages />
  </div>

  <div class="pages-icon">
    <NavbarItems />
  </div>
  <div class="nav-burger">
    <Navburger>
      <NavbarItems />
    </Navburger>
  </div>
</div>

<slot />

<style>
  .navbar {
    background-color: var(--bg-3);
    display: flex;
    justify-content: space-between;
    width: 100%;
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    height: 3.7rem;
  }

  .nav-item {
    padding: 1rem;
    color: var(--text);
    background-color: var(--bg-3);
    display: flex;
  }

  .pages-icon {
    display: flex;
  }

  .nav-burger {
    display: none;
  }

  @media (max-width: 680px) {
    .navbar {
      height: auto;
    }

    .pages-icon {
      display: none;
    }

    .nav-burger {
      display: block;
    }
  }
</style>
