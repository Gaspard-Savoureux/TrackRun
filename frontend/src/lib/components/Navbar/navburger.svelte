<script lang="ts">
  import { MenuIcon, XIcon } from 'svelte-feather-icons';
  import Modal from '$lib/components/informative-modal.svelte';

  let active = false;
  let heightOffset: number;
  let widthOffset: number;
</script>

<div class="navburger" style={`--heigth-offset: ${heightOffset}px`}>
  <Modal>
    <button class="nav-item" on:click={() => (active = !active)} bind:clientHeight={heightOffset}>
      {#if active}
        <XIcon />
      {:else}
        <MenuIcon />
      {/if}
    </button>
  </Modal>
  <div
    class="navburger-list"
    class:active
    bind:clientWidth={widthOffset}
    style={`--width-offset: -${widthOffset}px`}
  >
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
    top: var(--heigth-offset);
    right: var(--width-offset);
    transition: right 0.3s ease-in-out;
    overflow-x: clip;
  }

  .active {
    top: 0;
    right: 0;
    position: relative;
  }

  .nav-item {
    padding: 1rem;
    color: var(--text);
    display: flex;
  }

  .nav-item:hover {
    background-color: var(--blue);
  }

  button {
    border: none;
    background-color: inherit;
    margin-left: auto;
  }
</style>
