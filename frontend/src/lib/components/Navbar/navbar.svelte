<script lang="ts">
  import { onMount } from 'svelte';
  import TrainerNavbar from './TrainerNavbar.svelte';
  import UserNavbar from './UserNavbar.svelte';

  let isTrainer = false;

  onMount(() => {
    isTrainer = localStorage.getItem('isTrainer') === 'true';
  });
</script>

{#if isTrainer}
  <TrainerNavbar />
{:else}
  <UserNavbar />
{/if}

<slot />
