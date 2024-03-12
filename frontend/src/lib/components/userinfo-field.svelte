<script lang="ts">
  export let name: string;
</script>

<div class={'item'}>
  <h3>{name}</h3>
  {#if $$slots.default}
    <span><slot /></span>
  {:else}
    <span class="notset">Not specified</span>
  {/if}
</div>

<style>
  .item {
    display: flex;
    margin: 1rem;
  }

  span {
    align-self: center;
  }

  .notset {
    color: var(--text-light);
  }

  h3 {
    margin-right: 1rem;
  }
</style>
