<script lang="ts">
  import Modal from '$lib/components/informative-modal.svelte';
  import NavbarItems from './navbar-items.svelte';

  import { ActivityIcon, HomeIcon } from 'svelte-feather-icons';
  import Navburger from './navburger.svelte';

  let width: number; // width in px
  $: isSmallScreen = width <= 500;
</script>

<div class="navbar" bind:clientWidth={width}>
  <div class="pages-icon">
    <Modal info="Home" href="/">
      <div class="nav-item">
        <HomeIcon />
      </div>
    </Modal>
  </div>
  {#if !isSmallScreen}
    <div class="pages-icon">
      <Modal info="Activities" href="/activities">
        <div class="nav-item">
          <ActivityIcon />
          <p>Activities</p>
        </div>
      </Modal>
    </div>
  {/if}
  <div class="pages-icon">
    {#if !isSmallScreen}
      <NavbarItems />
    {:else}
      <Navburger>
        <NavbarItems {isSmallScreen} />
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

  p {
    position: relative;
    margin-left: 1rem;
  }
</style>
