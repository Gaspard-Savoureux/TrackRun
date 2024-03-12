<script lang="ts">
  import Item from '$lib/components/userinfo-field.svelte';
  import type { User } from '$lib/types/user';

  export let user: User;
</script>

<div class="row desktop">
  <div class="column">
    <Item name="Username" value={user?.username} />
    <Item name="Age" value={user?.age} />
    <Item name="Height" value={user?.height && user?.height + ' cm'} />
  </div>
  <div class="column">
    <Item name="Email" value={user?.email} />
    <Item name="Sex" value={user?.sex} />
    <Item name="Weight" value={user?.weight && user?.weight + ' kg'} />
  </div>

  <Item name="Description" value={user?.description} />
</div>

<div class="column mobile">
  <Item name="Username" value={user?.username} />
  <Item name="Email" value={user?.email} />
  <Item name="Age" value={user?.age} />
  <Item name="Sex" value={user?.sex} />
  <Item name="Height" value={user?.height && user?.height + ' cm'} />
  <Item name="Weight" value={user?.weight && user?.weight + ' kg'} />
  <Item name="Description"><p>{user?.description}</p></Item>
</div>

<style>
  .column {
    border-radius: 0.35rem;
    background-color: var(--bg-2);
    display: flex;
    flex-flow: column wrap;
  }
  .row {
    display: flex;
    flex-flow: row wrap;
    max-width: 40rem;
    margin: 0 auto;
    padding: 1rem;
    border-radius: 6px;
    background-color: var(--bg-2);
  }

  @media (width >= 576px) {
    .mobile {
      display: none;
    }
    .column {
      margin: 0 auto;
    }
  }

  @media (max-width: 576px) {
    .desktop {
      display: none;
    }
  }
</style>
