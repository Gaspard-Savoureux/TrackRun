<script lang="ts">
  export let href = '#';
  export let info = '';

  let showModal = false;
</script>

<a {href} on:mouseenter={() => (showModal = true)} on:mouseleave={() => (showModal = false)}>
  <slot />

  {#if showModal}
    <div class="modal">{info}</div>
  {/if}
</a>

<style>
  .modal {
    position: absolute;
    text-decoration: none;
    color: var(--text);
    background-color: var(--bg-2);
    border-radius: 0.2rem;
    padding: 0.3rem;
  }

  a:link {
    text-decoration: none;
    color: var(--text);
  }
</style>
