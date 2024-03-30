<script lang="ts">
  import type { PageData } from './$types';
  import UserCard from '$lib/components/user-card.svelte';

  export let data: PageData;

  $: ({ user } = data);
</script>

<svelte:head>
  <title>Profile</title>
</svelte:head>

<section>
  <div class="container">
    <UserCard {user} />
  </div>
</section>

<style>
  :root {
    --transition-delay: 0.3s;
  }

  section {
    padding: 2rem 1.5rem;
    /* max-width: 30rem; */
  }

  .container {
    display: grid;
    grid-template-columns: calc(2 * 1rem + 260px) 1fr;
    gap: 1rem;
  }
</style>
