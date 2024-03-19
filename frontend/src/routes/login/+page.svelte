<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { AlertCircleIcon, AlertTriangleIcon } from 'svelte-feather-icons';

  $: message = $page.url.searchParams.get('message') ?? '';

  export let form;
</script>

<svelte:head>
  <title>Log in</title>
</svelte:head>

<section>
  {#if message && form?.success !== false}
    <div class="notification-container">
      <div class="notification-icon">
        <AlertCircleIcon />
      </div>
      <p class="notification-text">
        {message}
      </p>
    </div>
  {/if}
  {#if form?.success === false}
    <div class="notification-container danger">
      <div class="notification-icon danger">
        <AlertTriangleIcon />
      </div>
      <p class="notification-text danger">
        {form?.message}
      </p>
    </div>
  {/if}
  <div class="container">
    <h1>Log in</h1>
    <form method="POST" use:enhance>
      <input
        type="text"
        placeholder="Enter your username"
        name="username"
        value={form?.username ?? ''}
      />
      <input type="password" placeholder="Enter your password" name="password" />
      <button class="link" type="submit">Log in</button>
      <hr />
      <div class="text-center">
        Don't have an account?
        <a href="/register">Register</a>
      </div>
    </form>
  </div>
</section>

<style>
  section {
    padding: 3rem 1.5rem;
  }

  .notification-container {
    display: flex;
    align-items: center;
    padding: 1rem;
    max-width: 32rem;
    margin: 0 auto 1rem auto;
    border-radius: 0.35rem;
    color: var(--text-info);
    background-color: var(--bg-info);
  }

  .notification-container.danger {
    background-color: var(--bg-danger);
  }

  .notification-text {
    font-style: italic;
    padding: 0 0.6rem;
  }

  .notification-icon {
    display: flex;
    flex-shrink: 0;
  }

  .container {
    padding: 1rem;
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
