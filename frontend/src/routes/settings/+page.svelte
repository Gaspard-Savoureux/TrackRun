<script lang="ts">
  import ThemeSwitcher from "$lib/components/theme-switcher.svelte";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;

  console.log(data)
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<section>
  <h1>Settings</h1>
  <h2>Update user profile</h2>
  <form method="POST">
    <label>
      Username
      <input type="text" name="username" value={data.user.username} />
    </label>
    <label>
      Password
      <input type="password" name="password" />
    </label>
    <label>
      Age
      <input type="text" name="age" value={data.user.age} />
    </label>
    <label>
      Height
      <input type="text" name="height" value={data.user.height} />
    </label>
    <label>
      Weight
      <input type="text" name="weight" value={data.user.weight} />
    </label>
    <div>
      <button type="submit">Update</button>
      <!-- <a class="button" href="/profile">Cancel</a> -->
    </div>
  </form>
  <hr />
  <h2>Update password</h2>
  <form method="POST" action="?/password">
    <label>
      Password
      <input type="password" name="password" />
    </label>
    <label>
      Confirm Password
      <input type="password" name="password" />
    </label>
    <div>
      <button type="submit">Update</button>
      <!-- <a class="button" href="/profile">Cancel</a> -->
    </div>
  </form>
  <hr />
  <h2>Theme</h2>
  <ThemeSwitcher />
  <hr />
  <h2>Logout</h2>
  <a class="button danger" href="/logout">logout</a>
</section>

<style>
  section {
    padding: 2rem 1rem;
    max-width: 1296px;
    margin: 0 auto;
  }

  @media (width >= 576px) {
    section {
      padding: 2rem;
    }
  }

  h1 {
    font-size: 2.5rem;
    margin: 0 0 1.5rem 0;
    text-align: center;
  }

  h2 {

    margin: 0 0 1.5rem 0;
  }

  label {
    display: flex;
    flex-direction: column;
    font-size: 0.85rem;
    font-weight: bold;
    text-transform: uppercase;
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

  @media (width >= 576px) {
    input {
      width: 100%;
      max-width: 30rem;
    }
  }

  input:focus-visible {
    outline: var(--link) solid 1px;
    border-color: var(--link);
  }

  button, .button {
    display: inline-block;
    font-family: inherit;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-button);
    padding: 0.47em 1em;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    background-color: var(--blue);
    transition: 0.2s;
    text-decoration: none;
    box-sizing: border-box;
  }

  button:hover, .button:hover {
    background-color: var(--blue-darker);
  }

  .danger {
    background-color: var(--danger);
  }

  .danger:hover {
    background-color: var(--danger-darker);
  }

  hr {
    margin: 1rem 0;
    color: var(--text-light);
  }
</style>
