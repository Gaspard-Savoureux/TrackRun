<script lang="ts">
  import Item from '$lib/components/userinfo-field.svelte';
  import type { User } from '$lib/types/user';

  export let user: User;
</script>

<div class="row desktop">
  <div class="column">
    <Item name="Username">{user?.username}</Item>
    <Item name="Age">{user?.age}</Item>
    <Item name="Height">{user?.height && user?.height + ' cm'}</Item>
  </div>
  <div class="column">
    <Item name="Email">{user?.email}</Item>
    <Item name="Sex">{user?.sex}</Item>
    <Item name="Weight">{user?.weight && user?.weight + ' kg'}</Item>
  </div>

  <Item name="Description">{user?.description}</Item>
</div>

<div class="column mobile">
  <Item name="Username">{user?.username}</Item>
  <Item name="Age">{user?.age}</Item>
  <Item name="Height">{user?.height && user?.height + ' cm'}</Item>
  <Item name="Email">{user?.email}</Item>
  <Item name="Sex">{user?.sex}</Item>
  <Item name="Weight">{user?.weight && user?.weight + ' kg'}</Item>
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
