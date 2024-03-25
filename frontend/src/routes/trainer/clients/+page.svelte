<script lang="ts">
  import UserinfoField from '$lib/components/userinfo-field.svelte';
  import type { User } from '$lib/types/user';
  import { Trash2Icon, UserIcon } from 'svelte-feather-icons';

  // export let form: formDataTrainer;

  // export let data;
  // $: ({ users } = data);

  const users: User[] = [
    {
      username: 'Archibald',
      email: 'juanpadrejean-papa@outlook.com',
      name: 'Juanpadre jean-papa',
      age: 22,
      height: 160.03,
      weight: 60.12,
      sex: 'female',
      // img: '85-1hRzlpVLXy6awZ3TyxxU.png',
      description:
        'Juanpadre jean-papa, the 4th of the name, likes bananas, asijdhaishdbvashdb hkjasb daksjbnd kjasb dkjasb kjbd dkjbaskj dbaksj dbkajsbd kajsbd kjasbd kajsb daksjbd kajsb dkjsabd kjasb dkjasb d',
    },
    {
      username: 'Michael',
      email: 'juanpadrejuanpadre@gmail.com',
      name: 'Juanpadre Juanpadre',
      age: 54,
      height: 184.38,
      weight: 88.13,
      sex: 'male',
      // img: '29-JLh7Er60V8cAthHfe831.png',
      description: 'Juanpadre Juanpadre, the 10th of the name, likes bananas',
    },
    // ... (8 more users)
  ];
  let currentUser: User | null;

  /** Trainer list related**/
  const setCurrentUser = (user: User) => {
    currentUser = currentUser === user ? null : user;
  };
</script>

<svelte:head>
  <title>Admin-Dashboard</title>
</svelte:head>

<section>
  <div class="grid-container">
    <div class="top">
      <div></div>
      <h1>Clients List</h1>
    </div>

    <div class="list">
      <h3>Clients:</h3>
      <div class="list-content">
        {#each users as user}
          <button class="list-item" on:click={() => setCurrentUser(user)}>
            <div>
              <p id="name">{user.username}</p>
              <p id="name">{user.name}</p>
            </div>
            <button class="delete-btn">
              <Trash2Icon size="20" />
            </button>
          </button>
        {/each}
      </div>
    </div>

    <div class="main">
      <div class="top-section">
        <h3>User Info:</h3>
      </div>
      {#if currentUser}
        <div class="user-info">
          <UserinfoField name="Username" value={currentUser?.username} />
          {#if currentUser?.img}
            <img src={currentUser?.img} alt={currentUser?.username + 'image'} />
            {currentUser?.img}
          {:else}
            <UserIcon size="100" />
          {/if}

          <UserinfoField name="Name" value={currentUser?.name} />
          <UserinfoField name="Email" value={currentUser?.email} />

          <UserinfoField name="Height" value={currentUser?.height} />
          <UserinfoField name="Sex" value={currentUser?.sex} />

          <UserinfoField name="Age" value={currentUser?.age} />
          <UserinfoField name="Weight" value={currentUser?.weight} />

          <span style="grid-column: 1 / -1;">
            <UserinfoField name="Description" value={currentUser?.description} />
          </span>

          <button>User's activities</button>
          <button>Add Activity</button>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  section {
    padding: 1.5rem;
    max-width: 80rem;
    max-height: 40rem;
    margin: 0 auto;
  }

  /* TOP/TITLE section */
  .top {
    grid-area: top;
    display: inline-grid;
    grid-template-columns: 1fr 4fr 1fr;
    text-align: center;
  }

  @media (max-width: 576px) {
    .top {
      display: flex;
      flex-direction: column;
    }
  }

  h1 {
    padding: 1rem;
  }

  /* LIST TRAINER */
  .list {
    grid-area: list;
    display: flex;
    flex-wrap: column;
    flex-direction: column;
    background-color: var(--bg-3);
  }

  .list-content {
    display: flex;
    flex-wrap: column;
    flex-direction: column;
    overflow-y: auto;
    min-width: 4rem;
    height: 40rem;
  }

  .list-item {
    border: 2px solid var(--bg-3);
    border-radius: 6px;
    border-color: --var(--text);
    color: var(--text);
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
    background-color: var(--danger-button);
    border-radius: 4px;
    border: none;
  }

  .delete-btn:hover {
    background-color: var(--danger-darker);
  }

  /* MAIN/INFO */
  .main {
    grid-area: main;
    background-color: var(--bg-3);
    height: auto;
  }

  .user-info {
    display: grid;
    grid-template-columns: repeat(2, minmax(10rem, 1fr));
    grid-template-rows: 10rem;
    background-color: var(--bg-2);
    align-items: center;
    justify-content: space-between;
  }

  .user-info > button {
    font-size: 1.5em;
    border: none;
    border-radius: 4px;
    min-width: 8rem;
    justify-self: center;
    padding: 1rem;
    margin: 1rem;
  }

  .user-info > button:hover {
    font-size: 1.5em;
    background-color: var(--success);
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
      'list main main';
    gap: 2rem;
    padding: 1rem;
  }

  :global(html, body) {
    overflow: auto;
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
  .main {
    border-radius: 6px;
    padding: 1rem;
  }

  /* OTHER */
  button:hover {
    background-color: var(--blue-darker);
  }
</style>
