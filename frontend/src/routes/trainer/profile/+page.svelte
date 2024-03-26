<script lang="ts">
  import TrainerInfo from '$lib/components/trainer-info.svelte';
  import type { Trainer } from '$lib/types/trainer';
  import type { PageData } from './$types';

  export let data: PageData & { trainer: Trainer };

  $: ({ trainer } = data);
</script>

<svelte:head>
  <title>Profile</title>
</svelte:head>

<section>
  <h1>Your Profile</h1>
  <TrainerInfo {trainer} />
</section>

<style>
  section {
    padding: 3rem 1.5rem;
  }

  h1 {
    font-size: 2.5rem;
    margin: 0 0 1.5rem 0;
    text-align: center;
  }
</style>
