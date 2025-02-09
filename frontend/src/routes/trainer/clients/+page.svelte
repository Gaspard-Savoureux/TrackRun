<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import UserinfoField from '$lib/components/userinfo-field.svelte';
  import type { User } from '$lib/types/user';
  import { UserIcon, UserMinusIcon } from 'svelte-feather-icons';
  import { API_URL } from '../../../constants';

  export let data;
  $: ({ users } = data);

  let filter = '';
  $: formattedFilter = filter.toLocaleLowerCase();
  $: filteredUsers = users.filter((user: User) => {
    return (
      user.username?.toLowerCase().includes(formattedFilter) ||
      user.name?.toLowerCase().includes(formattedFilter)
    );
  });

  let currentUser: User | null;
  let displayInfo = false;

  /** Users list related**/
  const setCurrentUser = (user: User) => {
    const closing = currentUser === user && displayInfo;
    if (closing) {
      setTimeout(() => {
        currentUser = currentUser === user ? null : user;
      }, 500);
    } else {
      currentUser = currentUser === user ? null : user;
    }
    displayInfo = !closing;
  };

  const removeUser = async (event: Event, user: User) => {
    event.stopPropagation();
    if (currentUser === user) {
      setTimeout(() => {
        currentUser = null;
      }, 500);
      displayInfo = false;
    }
    await fetch(`${API_URL}/trainer/user/${user.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    invalidateAll();
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
      <input type="text" placeholder="Name / Username" bind:value={filter} />
      <div class="list-column-names">
        <p class="username">Username</p>
        <p class="name">Name</p>
        <p class="remove">Remove</p>
      </div>
      <hr />
      <div class="list-content">
        {#each filteredUsers as user}
          <button class="list-item" on:click={() => setCurrentUser(user)}>
            <p class="username">{user.username}</p>
            <p class="name">{user.name ? user.name : 'Not specified'}</p>
            <div class="remove">
              <button class="delete-btn" on:click={(event) => removeUser(event, user)}>
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
      <div class="user-info" class:displayInfo>
        <UserinfoField name="Username" value={currentUser?.username} />
        {#if currentUser?.img}
          <img
            src={API_URL + '/uploads/' + currentUser?.img}
            alt={currentUser?.username + 'image'}
            height="100px"
            width="100px"
          />
        {:else}
          <span class="user-icon"><UserIcon size="100" /> </span>
        {/if}

        <UserinfoField name="Name" value={currentUser?.name} />
        <UserinfoField name="Email" value={currentUser?.email} />
        <UserinfoField name="Height" value={currentUser?.height && currentUser?.height + ' cm'} />
        <UserinfoField name="Sex" value={currentUser?.sex} />

        <UserinfoField name="Age" value={currentUser?.age} />
        <UserinfoField name="Weight" value={currentUser?.weight && currentUser?.weight + ' kg'} />

        <span style="grid-column: 1 / -1;">
          <UserinfoField name="Description" value={currentUser?.description} />
        </span>

        <button>Client activities</button>
        <button>Add Activity</button>
      </div>
    </div>
  </div>
</section>

<style>
  section {
    padding: 1.5rem;
    max-width: 80rem;
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

  input {
    margin-bottom: 1rem;
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
    text-align: center;
  }

  @media (max-width: 800px) {
    .name {
      display: none;
    }
  }

  .list-content {
    display: flex;
    flex-wrap: column;
    flex-direction: column;
    overflow-y: auto;
    height: 40rem;
  }

  @media (max-width: 576px) {
    .list-content {
      height: 16rem;
    }
  }

  .list-item {
    border: 2px solid var(--bg-3);
    border-radius: 4px;
    border-color: --var(--text);
    color: var(--text);
    display: flex;
    flex: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    height: 3.2rem;
    transition: height 0.2s ease-in-out;
  }

  .list-item:hover {
    background-color: inherit;
    border-color: var(--success);
    color: var(--text);
    height: 4rem;
  }

  .list-item > p,
  img {
    padding: 0.5rem 0;
  }

  .delete-btn {
    color: var(--text-button);
    border-color: var(--text);
    background-color: var(--danger-button);
    border-radius: 4px;
    border: none;
    transition: padding 0.2s ease-in-out;
  }

  .delete-btn:hover {
    background-color: var(--danger-darker);
    padding: 1rem;
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
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.4s ease-in-out;
  }

  .user-info.displayInfo {
    max-height: 80rem;
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
      align-items: unset;
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
    transition: padding 0.2s ease-in-out;
  }

  .user-info > button:hover {
    background-color: var(--success);
    padding: 1.4rem;
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
  hr {
    margin: 0.1rem;
  }
</style>
