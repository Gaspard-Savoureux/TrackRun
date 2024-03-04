<script lang="ts">
  export let name: string;
  export let value: unknown;
  export let unaligned = false;
</script>

<div class={unaligned ? 'item-unaligned' : 'item'}>
  <h3>{name}</h3>
  {#if value}
    {value}
  {:else}
    <span class="notset">Not specified</span>
  {/if}
</div>

<style>
  .item {
    display: flex;
    align-items: center;
    margin: 1rem;
  }

  .item-unaligned {
    display: flex;
    margin: 1rem;
  }

  .notset {
    color: var(--text-light);
  }

  h3 {
    margin-right: 1rem;
  }
</style>
