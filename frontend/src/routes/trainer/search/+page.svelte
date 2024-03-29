<script lang="ts">
  import type { PageData } from './$types';
  import type { User } from '$lib/types/user';
  import { API_URL } from '../../../constants';
  import { onMount } from 'svelte';
  import { ArrowUpIcon } from 'svelte-feather-icons';

  export let data: PageData;
  $: ({ users } = data);

  let query = '';
  let assignedUsers: User[] = [];
  onMount(fetchAssignedUsers);

  // Filter the users list
  $: filteredUsers = users.filter((user: User) => {
    // filterer list by user name, name or email
    return (
      user.name?.toLowerCase().includes(query.toLowerCase()) ||
      user.username?.toLowerCase().includes(query.toLowerCase()) ||
      user.email?.toLowerCase().includes(query.toLowerCase())
    );
  });

  async function addUserToTrainer(id: number) {
    const response = await fetch(`${API_URL}/trainer/user/${id}`, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.status === 409) {
      alert('User already assigned to another trainer');
    }
    fetchAssignedUsers();
  }

  async function removeUserFromTrainer(id: number) {
    const response = await fetch(`${API_URL}/trainer/user/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.status === 404) {
      alert('User not assigned to you, trainer');
    }
    fetchAssignedUsers();
  }

  async function fetchAssignedUsers() {
    // TODO changer routes
    const res = await fetch(`${API_URL}/trainer/users/assigned`, {
      method: 'GET',
      credentials: 'include',
    });

    if (res.ok) {
      assignedUsers = await res.json();
    }
  }
</script>

<section>
  <div class="paper-container">
    <div class="paper">
      <div class="paper-title">Search for users</div>
      <div class="paper-content">
        <input type="text" class="textfield" bind:value={query} placeholder="Name / Username" />
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
      {#each filteredUsers as item (item.id)}
        <tr>
          <td>{item.name}</td>
          <td>{item.username}</td>
          <td>{item.email}</td>
          <td>
            {#if assignedUsers.some((trainerUser) => trainerUser.id === item.id)}
              <button class="remove-button" on:click={() => removeUserFromTrainer(item.id)}
                >Remove User</button
              >
            {:else}
              <button class="add-button" on:click={() => addUserToTrainer(item.id)}>Add User</button
              >
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
    /* border-radius: 4px; */
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
    /* align-content: center; */
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
</style>
