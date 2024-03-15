<script lang="ts">
  import Item from '$lib/components/userinfo-field.svelte';
  export let data;

  $: ({ user } = data);
</script>

<svelte:head>
  <title>Profile</title>
</svelte:head>

<section>
  <h1>Your Profile</h1>
  <div class="column">
    <div class="row">
      <Item name="Username">{user?.username}</Item>
      <Item name="Email">{user?.email}</Item>
    </div>
    <div class="row">
      <Item name="Age">{user?.age}</Item>
      <Item name="Sex">{user?.sex}</Item>
    </div>
    <div class="row">
      <Item name="Height">{user?.height && user?.height + ' cm'}</Item>
      <Item name="Weight">{user?.weight && user?.weight + ' kg'}</Item>
    </div>
    <Item name="Description">{user?.description}</Item>
  </div>
</section>

<style>
  section {
    padding: 3rem 1.5rem;
  }

  .column {
    padding: 1rem;
    max-width: 40rem;
    margin: 0 auto;
    border-radius: 0.35rem;
    background-color: var(--bg-2);
    display: flex;
    flex-flow: column wrap;
  }

  @media (width >= 500px) {
    .column {
      padding: 2rem;
    }
  }

  .row {
    display: flex;
    flex-flow: row wrap;
  }

  h1 {
    font-size: 2.5rem;
    margin: 0 0 1.5rem 0;
    text-align: center;
  }
</style>
