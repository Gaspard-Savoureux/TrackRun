<script lang="ts">
  import type { PageData } from "./$types";
  // type PageUserData =
  export let data: PageData;

  // $: ({ user } = data);
</script>

<svelte:head>
  <title>Infos</title>
</svelte:head>

<section>
  <div class="container">
    <h1>User Info</h1>
    <div>username: {data.user?.username}</div>
    <!-- <div>sex: {user?.sex}</div> -->
    <!-- {data.user?.description} -->
    <!-- {user?.sex} -->
    <div>{JSON.stringify(data)}</div>
  </div>
</section>

<style>
  section {
    padding: 3rem 1.5rem;
  }

  .container {
    padding: 1rem;
    max-width: 30rem;
    margin: 0 auto;
    border-radius: 0.35rem;
    background-color: var(--bg-2);
  }

  @media (width >= 500px) {
    .container {
      padding: 2rem;
    }
  }

  h1 {
    font-size: 2.5rem;
    margin: 0 0 1.5rem 0;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  input:focus-visible {
    outline: var(--link) solid 1px;
    border-color: var(--link);
  }

  button {
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

  hr {
    color: var(--text-light);
  }
</style>
