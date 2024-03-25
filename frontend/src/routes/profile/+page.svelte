<script lang="ts">
  import UserInfo from '$lib/components/user-info.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: ({ user } = data);
</script>

<svelte:head>
  <title>Profile</title>
</svelte:head>

<section>
  <h1>Your Profile</h1>
  <UserInfo {user} />
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
