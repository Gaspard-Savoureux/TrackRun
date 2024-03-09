<script lang="ts">
  import Modal from '$lib/components/informative-modal.svelte';
  import NavbarItems from './navbar-items.svelte';

  import { HomeIcon } from 'svelte-feather-icons';
  import Navburger from './navburger.svelte';

  let width;
</script>

<div class="navbar" bind:clientWidth={width}>
  <div class="pages-icon">
    <Modal info="Home" href="/">
      <div class="nav-item">
        <HomeIcon />
      </div>
    </Modal>
  </div>

  <div class="pages-icon">
    {#if width >= 500}
      <NavbarItems />
    {:else}
      <Navburger>
        <NavbarItems />
      </Navburger>
    {/if}
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

  .nav-item:hover {
    background-color: var(--blue);
  }
</style>
