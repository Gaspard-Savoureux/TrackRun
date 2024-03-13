<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidate, invalidateAll } from '$app/navigation';
  import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
  import UserinfoField from '$lib/components/userinfo-field.svelte';
  import type { JsonBodyResponse } from '$lib/types/JsonBodyResponse.js';
  import type { Trainer } from '$lib/types/trainer.js';
  import type { formDataTrainer, trainerFields } from '$lib/types/trainerField.js';
  import { Trash2Icon, PlusIcon, MinusIcon, Edit2Icon, XIcon } from 'svelte-feather-icons';

  export let form: formDataTrainer;

  export let data;

  $: ({ trainers } = data);
  let currentTrainer: Trainer | null;

  const setCurrentTrainer = (trainer: Trainer) => {
    if (currentTrainer === trainer) {
      currentTrainer = null;
    } else {
      currentTrainer = trainer;
    }
  };

  /** Trainer list related**/
  const deleteTrainer = async (trainerId: number | undefined) => {
    await fetch(`/admin/dashboard/${trainerId}`, { method: 'DELETE' });
    return invalidate('/admin/dashboard');
  };

  /** Infos related**/
  let editing = false;
  let editForm: HTMLFormElement;
  let dataEdited: JsonBodyResponse = {
    message: '',
    success: true,
  };

  const editTrainer = async () => {
    const formData = new FormData(editForm);
    const data = Object.fromEntries(formData);

    const res = await fetch(`/admin/dashboard/${currentTrainer?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    dataEdited = await res.json();

    invalidateAll();
  };

  /** ADD trainer related**/
  const formData: trainerFields = {
    username: '',
    name: '',
    email: '',
    password: '',
  };
  let trainerFormFilled = false;
  const fillTemplateTrainer = () => {
    if (!trainerFormFilled) {
      formData.username = `trainer-${trainers.length}`;
      formData.name = `trainer numero ${trainers.length}`;
      formData.email = `trainer${trainers.length}@delicieux.jambon.com`;
      formData.password = '1234';
    } else {
      formData.username = '';
      formData.name = '';
      formData.email = '';
      formData.password = '';
    }
    trainerFormFilled = !trainerFormFilled;
  };
</script>

<svelte:head>
  <title>Admin-Dashboard</title>
</svelte:head>

<section>
  <div class="grid-container">
    <div class="top">
      <div></div>
      <h1>Admin Dashboard</h1>
      <div>
        <ThemeSwitcher />
      </div>
    </div>

    <div class="list">
      <h3>Trainers:</h3>
      {#each trainers as trainer}
        <button class="list-item" on:click={() => setCurrentTrainer(trainer)}>
          <p id="name">{trainer.username}</p>
          <button class="delete-btn" on:click={() => deleteTrainer(trainer.id)}>
            <Trash2Icon size="20" />
          </button>
        </button>
      {/each}
    </div>

    <div class="main">
      <div class="top-section">
        <h3>Info:</h3>
        {#if currentTrainer && !editing}
          <button class="edit-btn" on:click={() => (editing = !editing)}><Edit2Icon /></button>
        {:else if editing}
          <button class="edit-btn close" on:click={() => (editing = !editing)}><XIcon /></button>
        {/if}
      </div>
      {#if !editing && currentTrainer}
        <UserinfoField name="Id" value={currentTrainer?.id} />
        <UserinfoField name="Username" value={currentTrainer?.username} />
        <UserinfoField name="Name" value={currentTrainer?.name} />
        <UserinfoField name="email" value={currentTrainer?.email} />
      {:else if currentTrainer}
        <div class="container">
          <form
            method="PUT"
            action={`?/${currentTrainer.id}`}
            bind:this={editForm}
            on:submit={editTrainer}
          >
            <label for="username">
              Username:
              <input type="text" placeholder={currentTrainer.username} name="username" />
            </label>
            <label for="name">
              Name:
              <input type="text" placeholder={currentTrainer.name} name="name" />
            </label>
            <label for="email">
              Email:
              <input type="email" placeholder={currentTrainer.email} name="email" />
            </label>
            <label for="password">
              Password:
              <input type="password" placeholder="New password" name="password" />
            </label>

            {#if dataEdited.success === false}<p class="danger">{dataEdited.message}</p>{/if}
            <button class="" type="submit">Modifier</button>
            <hr />
          </form>
        </div>
      {/if}
    </div>

    <div class="new">
      <div class="top-section">
        <h3>Ajouter entraîneur:</h3>
        <button class="add-trainer-template" class:trainerFormFilled on:click={fillTemplateTrainer}>
          {#if trainerFormFilled}
            <span class="minus"> <MinusIcon size="20" /> </span>
          {:else}
            <span class="plus"><PlusIcon size="20" /></span>
          {/if}
        </button>
      </div>
      <div class="container">
        <form method="POST" use:enhance action="?/createTrainer" on:submit={fillTemplateTrainer}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={form?.username ?? formData?.username}
          />
          <input type="text" placeholder="Name" name="name" value={form?.name ?? formData?.name} />
          <input
            type="email"
            placeholder="email@example.com"
            name="email"
            value={form?.email ?? formData?.email}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            value={formData?.password}
          />

          {#if form?.success === false}<p class="danger">{form?.message}</p>{/if}
          <button class="" type="submit">Ajouter</button>
          <hr />
        </form>
      </div>
    </div>
  </div>
</section>

<style>
  section {
    padding: 1.5rem;
    max-width: 60rem;
    margin: 0 auto;
  }

  h1 {
    padding: 1rem;
  }

  .top {
    grid-area: top;
    text-align: center;
    display: flex;
    justify-content: space-between;
  }

  /* LIST TRAINER */
  .list {
    grid-area: list;
    display: flex;
    flex-wrap: column;
    flex-direction: column;
    background-color: var(--bg-3);
    overflow-y: scroll;
    min-width: 4rem;
    height: 40rem;
  }

  .list-item {
    border: 2px solid var(--bg-3);
    border-radius: 6px;
    border-color: --var(--text);
    color: var(--text);
    /* box-shadow:
      0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
      0 0px 0 1px rgba(10, 10, 10, 0.02); */
    padding: 1.25rem;
    display: flex;
    flex: row;
    justify-content: space-between;
    align-items: center;
    min-width: 2rem;
  }

  .list-item:hover {
    background-color: inherit;
    border-color: var(--success);
    color: var(--text);
  }

  .delete-btn {
    color: var(--text-button);
    border-color: var(--text);
    background-color: var(--danger);
    border-radius: 6px;
    border: none;
  }

  .delete-btn:hover {
    background-color: var(--success);
  }

  /* MAIN/INFO */
  .main {
    grid-area: main;
    background-color: var(--bg-3);
    /* max-width: 30rem; */
    /* min-width: 20rem; */
    /* width: 32rem; */
    /* width: 90%; */
  }

  .edit-btn {
    all: unset;
    border-radius: 50%;
    border-color: var(--text);
    padding: 0.3rem;
  }

  .edit-btn:hover {
    background-color: var(--success);
  }
  .edit-btn.close:hover {
    background-color: var(--danger);
  }

  /* NEW TRAINER */
  .new {
    grid-area: new;
    background-color: var(--bg-3);
  }

  .add-trainer-template {
    all: unset;
    height: 20px;
    border: 3px solid var(--text);
    border-radius: 6px;
  }

  .add-trainer-template:hover {
    background-color: var(--success);
  }
  .trainerFormFilled:hover {
    background-color: var(--danger);
  }

  /* LAYOUT */
  .grid-container {
    background-color: var(--bg-2);
    display: grid;
    grid-template-columns: 2fr 2fr 2fr;
    grid-template-rows: 0fr 1.1fr 2fr;
    grid-template-areas:
      'top  top top'
      'list main main'
      'list new new';

    /* grid-template-areas:
      'top top top top top top top'
      'list list main main main main main'
      'list list main main main main main'
      'list list main main main main main'
      'list list main main main main main'
      'list list new new new new new'
      'list list new new new new new'; */
    gap: 2rem;
    padding: 1rem;
  }

  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    height: 1.3rem;
  }
  @media (max-width: 700px) {
    .grid-container {
      display: flex;
      flex-direction: column;
    }

    .main {
      min-width: 0;
    }

    :global(html, body) {
      overflow: scroll;
    }
  }
  .grid-container > .list,
  .main,
  .new {
    border-radius: 6px;
    padding: 1rem;
  }

  /* OTHER */
  .container {
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
