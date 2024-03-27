<script lang="ts">
  import Modal from '$lib/components/informative-modal.svelte';
  import NavbarItems from './trainer-navbar-items.svelte';
  import { HomeIcon } from 'svelte-feather-icons';
  import Navburger from './navburger.svelte';
  import TrainerPages from './trainer-pages.svelte';
</script>

<div class="navbar">
  <div class="" style="display: flex;">
    <Modal info="Home" href="/trainer">
      <div class="nav-item">
        <HomeIcon />
      </div>
    </Modal>
  </div>

  <div class="pages-icon">
    <TrainerPages />
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
    display: flex;
    display: none;
  }

  @media (max-width: 576px) {
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
