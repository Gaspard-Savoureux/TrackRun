<script lang="ts">
  import { enhance } from '$app/forms';
  // import UserInfo from '$lib/components/user-info.svelte';
  import UserinfoField from '$lib/components/userinfo-field.svelte';
  import type { Trainer } from '$lib/types/trainer.js';
  // import type { Trainer } from '$lib/types/trainer.js';
  import { Trash2Icon } from 'svelte-feather-icons';
  // Va devoir être dynamique
  const img =
    'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpluspng.com%2Fimg-png%2Fpng-user-icon-circled-user-icon-2240.png&f=1&nofb=1&ipt=57cfe19f82008a29af4e6808fc7e62295538f825b80750ef2e7c3616f673dc02&ipo=images';
  // const trainers = [
  //   { username: 'Michael', pic: img },
  //   { username: 'Jean', pic: img },
  //   { username: 'Charle', pic: img },
  // ];

  let form;

  export let data;

  $: ({ trainers } = data);
  let currentTrainer: Trainer = null;
  // const currentTrainer: Trainer = null;
</script>

<svelte:head>
  <title>Admin-Dashboard</title>
</svelte:head>

<section>
  <div class="grid-container">
    <div class="top">
      <h1>Admin Dashboard</h1>
    </div>
    <div class="list">
      <h3>Trainers:</h3>
      {#each trainers as trainer}
        <!-- eslint-disable-next-line svelte/valid-compile -->
        <div class="list-item" on:click={(currentTrainer = trainer)}>
          <img src={trainer.pic} alt={trainer.username} width="24" height="24" />
          <p id="name">{trainer.username}</p>
          <button class="delete-btn"><Trash2Icon size="20" /></button>
        </div>
      {/each}
    </div>
    <div class="main">
      <!-- <UserInfo {user} /> -->
      <UserinfoField name="Username">{currentTrainer?.name}</UserinfoField>
      <UserinfoField name="Name"></UserinfoField>
      <UserinfoField name="email"></UserinfoField>
      <UserinfoField name="password"></UserinfoField>
    </div>
    <div class="new">
      <!-- (Possiblement modal) -->
      <h2>Ajouter entraîneur:</h2>
      <div class="container">
        <!-- <h1>Admin</h1> -->
        <!-- <h2>Create user</h2> -->
        <form method="POST" action="?/create" use:enhance>
          <input type="text" placeholder="username" name="username" value={form?.username ?? ''} />
          <input type="password" placeholder="password" name="password" />

          {#if form?.success === false}<p class="danger">{form?.message}</p>{/if}
          <button class="link" type="submit">Create</button>
          <hr />
        </form>
      </div>
    </div>
  </div>
</section>

<style>
  section {
    padding: 1.5rem;
  }

  h1 {
    padding: 1rem;
  }

  .top {
    grid-area: top;
    /* background-color: var(--bg-3); */
    text-align: center;
  }

  .list {
    grid-area: list;
    /* background-color: red; */
    display: flex;
    flex-wrap: column;
    flex-direction: column;
    background-color: var(--bg-3);
  }

  .list-item {
    border: 2px solid var(--bg-3);
    border-radius: 6px;
    border-color: --var(--text);
    /* box-shadow:
      0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
      0 0px 0 1px rgba(10, 10, 10, 0.02); */
    padding: 1.25rem;
    display: flex;
    flex: row;
    justify-content: space-between;
    align-items: center;
    backdrop-filter: invert(80%);
    /* filter: invert(100%); */
  }

  .list-item > p {
    filter: invert(100%);
  }

  .main {
    grid-area: main;
    /* background-color: bisque; */
  }

  .new {
    grid-area: new;
  }

  .grid-container {
    background-color: var(--bg-2);
    display: grid;
    grid-template-areas:
      'top top top top top top'
      'list main main main main main'
      'list main main main main main'
      'new main main main main main'
      'new main main main main main';
    left: 5%;
    right: 10%;
  }

  /* h2 {
    background-color: var(--bg-3);
  } */

  h2 {
    text-align: center;
  }
  .delete-btn {
    color: var(--text-button);
    background-color: var(--danger);
    border-radius: 10px;
  }

  .container {
    /* padding: 1rem; */
    max-width: 30rem;
    margin: 0 auto;
    border-radius: 0.35rem;
    background-color: var(--bg-2);
  }

  @media (width >= 576px) {
    .container {
      padding: 2rem;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  input {
    font-size: 1.15rem;
    line-height: 1.5;
    box-sizing: border-box;
    display: inline-flex;
    height: 3.125rem;
    width: 100%;
    max-width: 100%;
    padding: 0.5rem 0.5rem;
    border-radius: 4px;
    border: 1px solid var(--text-light);
    background-color: inherit;
  }

  input:focus-visible {
    outline: var(--link) solid 1px;
    border-color: var(--link);
  }

  form > button {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-button);
    width: 100%;
    padding: 0.47em 1em;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    background-color: var(--blue);
    transition: 0.2s;
  }

  button:hover {
    background-color: var(--blue-darker);
  }
</style>
