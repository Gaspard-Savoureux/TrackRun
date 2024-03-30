<script lang="ts">
  import type { User } from '$lib/types/user';
  import { API_URL } from '../../../constants';
  import { onMount } from 'svelte';
  import { ArrowUpIcon } from 'svelte-feather-icons';

  let query = '';
  export let data;
  $: ({ trainerId } = data);

  let users: User[] = [];

  async function fetchUsers() {
    const res = await fetch(
      `${API_URL}/trainer/search/users?searchString=${encodeURIComponent(query)}`,
      {
        credentials: 'include',
      },
    );
    if (res.ok) {
      const data = await res.json();
      users = data.users;
    } else {
      throw new Error('Failed to fetch users');
    }
  }

  async function handleSubmit() {
    await fetchUsers();
  }

  async function addUserToTrainer(id: number) {
    const response = await fetch(`${API_URL}/trainer/user/${id}`, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.status === 409) {
      alert('User already assigned to another trainer');
    }
    fetchUsers();
  }

  async function removeUserFromTrainer(id: number) {
    const response = await fetch(`${API_URL}/trainer/user/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.status === 404) {
      alert('User not assigned to you, trainer');
    }
    fetchUsers();
  }

  onMount(async () => {
    await fetchUsers();
  });
</script>

<section>
  <div class="paper-container">
    <div class="paper">
      <div class="paper-title">Search for users</div>
      <div class="paper-content">
        <input
          type="text"
          class="textfield"
          bind:value={query}
          on:input={handleSubmit}
          placeholder="Name / Username"
        />
        <p class="helper-text">
          You can enter either a username or a name to match corresponding users in the following
          list
        </p>
      </div>
    </div>
    <pre class="status">Searching for: {query}</pre>
  </div>

  <table aria-label="User list">
    <thead>
      <tr>
        <th>
          <div>
            <p>Name</p>
            <ArrowUpIcon />
          </div>
        </th>
        <th
          ><div>
            <p>Username</p>
            <ArrowUpIcon />
          </div>
        </th>
        <th>
          <div>
            <p>Email</p>
            <ArrowUpIcon />
          </div>
        </th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each users as user (user.id)}
        <tr>
          <td>{user.name}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>
            {#if trainerId === user.trainerId}
              <button
                class="remove-button"
                on:click={() => user.id && removeUserFromTrainer(user.id)}
              >
                Remove User
              </button>
            {:else if user.trainerId !== null}
              <button class="no-button"> Already assigned to trainer </button>
            {:else}
              <button class="add-button" on:click={() => user.id && addUserToTrainer(user.id)}>
                Add User
              </button>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<style>
  /* for search */
  section {
    padding: 1.5rem;
    max-width: 80rem;
    margin: 0 auto;
  }

  .paper-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .paper {
    border-radius: 4px;
    background-color: var(--bg-2);
    box-shadow: 0 2px 4px var(--text-light);
    margin-bottom: 20px;
    width: 90%;
  }

  .paper-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 20px;
    text-align: center;
  }

  .paper-content {
    padding: 20px;
  }

  .textfield {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  .helper-text {
    font-size: 0.8rem;
    color: var(--text-info);
    margin-top: 5px;
  }

  .status {
    font-size: 0.8rem;
    color: var(--text-info);
    text-align: center;
  }

  /* for table */
  table {
    border-collapse: collapse;
    width: 100%;
  }

  th,
  td {
    border: 1px solid var(--bg-3);
    padding: 8px;
    text-align: left;
    align-content: center;
  }

  th {
    cursor: pointer;
  }

  th > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  th > div:hover {
    color: var(--blue);
  }

  tr:nth-child(even) {
    background-color: var(--bg-2);
  }

  button {
    padding: 8px 16px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }

  .add-button {
    background-color: var(--blue);
    min-width: 8rem;
    width: 100%;
    color: #fff;
  }

  .add-button:hover {
    background-color: var(--success);
  }

  .remove-button {
    background-color: var(--danger-button);
    width: 100%;
    color: #fff;
  }

  .remove-button:hover {
    background-color: var(--danger-darker);
  }

  .no-button {
    width: 100%;
  }

  .no-button:hover {
    cursor: not-allowed;
  }
</style>
