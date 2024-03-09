<script lang="ts">
  import { MenuIcon, XIcon } from 'svelte-feather-icons';
  import Modal from '$lib/components/informative-modal.svelte';

  let active = false;
</script>

<div class="navburger">
  <Modal info="Menu">
    <button class="nav-item" on:click={() => (active = !active)}>
      {#if active}
        <XIcon />
      {:else}
        <MenuIcon />
      {/if}
    </button>
  </Modal>
  <div class="navburger-list" class:active>
    <slot />
  </div>
</div>

<style>
  .navburger {
    display: flex;
    flex-direction: column;
    position: relative;
    max-height: 1rem;
  }

  .navburger-list {
    background-color: var(--bg-3);
    position: absolute;
    top: -20rem;
    transition: top 0.3s ease-in-out;
  }

  .nav-item {
    padding: 1rem;
    color: var(--text);
    display: flex;
  }

  .nav-item:hover {
    background-color: var(--blue);
  }

  .active {
    top: 0%;
    position: relative;
  }

  button {
    border: none;
    background-color: inherit;
  }
</style>
