<script lang="ts">
  import UserinfoField from '$lib/components/userinfo-field.svelte';
  import type { User } from '$lib/types/user';
  import { UserIcon, UserMinusIcon } from 'svelte-feather-icons';

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
      img: 'https://www.vhv.rs/dpng/d/551-5511364_circle-profile-man-hd-png-download.png',
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
  // $: filteredUsers= data.users;
  let filter = '';
  $: filteredUsers = users.filter(
    (user) => user.username?.indexOf(filter) !== -1 || user.name?.indexOf(filter) !== -1,
  );

  let currentUser: User | null;

  /** Users list related**/
  const setCurrentUser = (user: User) => {
    currentUser = currentUser === user ? null : user;
  };
</script>

<svelte:head>
  <title>Client List</title>
</svelte:head>

<section>
  <div class="grid-container">
    <div class="top">
      <div></div>
      <h1>Clients List</h1>
    </div>

    <div class="list">
      <div class="top-section">
        <h3>Clients:</h3>
      </div>
      <input type="text" placeholder="client name/username" bind:value={filter} />
      <div class="list-column-names">
        <p class="username">Username</p>
        <p class="name">Name</p>
        <p class="remove">Remove</p>
      </div>
      <div class="list-content">
        {#each filteredUsers as user}
          <button class="list-item" on:click={() => setCurrentUser(user)}>
            <p class="username">{user.username}</p>
            <p class="name">{user.name}</p>
            <div class="remove">
              <button class="delete-btn">
                <UserMinusIcon size="20" />
              </button>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <div class="main">
      <div class="top-section">
        <h3>Clients Info:</h3>
      </div>
      {#if currentUser}
        <div class="user-info">
          <UserinfoField name="Username" value={currentUser?.username} />
          {#if currentUser?.img}
            <img
              src={currentUser?.img}
              alt={currentUser?.username + 'image'}
              height="100px"
              width="100px"
            />
          {:else}
            <span class="user-icon"><UserIcon size="100" /> </span>
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

          <button>Client activities</button>
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
    /* max-height: 40rem; */
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

  .list-column-names {
    display: flex;
    flex-direction: row;
    color: var(--text-info);
    justify-content: space-between;
  }

  .username,
  .name,
  .remove {
    flex: 0 0 33%;
    overflow-x: hidden;
  }

  @media (max-width: 800px) {
    .name {
      display: none;
    }

    .username,
    .remove {
      flex: 0 0 50%;
    }
  }

  .list-content {
    display: flex;
    flex-wrap: column;
    flex-direction: column;
    overflow-y: auto;
    height: 40rem;
  }

  .list-item {
    border: 2px solid var(--bg-3);
    border-radius: 4px;
    border-color: --var(--text);
    color: var(--text);
    padding: 0.5rem;
    display: flex;
    flex: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
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
    margin-left: 40%;
  }

  .delete-btn:hover {
    background-color: var(--danger-darker);
  }

  .remove {
    align-items: center;
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

  .user-info > img,
  .user-icon {
    border-radius: 50%;
    margin: 0 auto;
  }

  @media (max-width: 800px) {
    .user-info {
      overflow: hidden;
    }
  }

  @media (max-width: 576px) {
    .user-info {
      all: unset;
      grid-template-columns: auto;
      display: flex;
      flex-direction: column;
    }

    .user-info > img,
    .user-icon {
      order: -1;
    }
  }

  .user-info > button {
    font-size: 1.1em;
    border: none;
    border-radius: 4px;
    min-width: 8rem;
    justify-self: center;
    padding: 1rem;
    margin: 1rem;
  }

  .user-info > button:hover {
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
    padding: 0.5rem;
  }

  /* OTHER */
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
</style>
