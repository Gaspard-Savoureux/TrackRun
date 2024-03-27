<script lang="ts">
  import type { PageData } from './$types';
  import type { User } from '$lib/types/user';
  import { API_URL } from '../../../constants';
  import { onMount } from 'svelte';

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
    if (!response.ok) {
      alert('Error adding user to trainer');
    }
    if (response.ok) {
      alert('User added to trainer');
    }
    // Refresh assigned users after adding
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
    if (!response.ok) {
      alert('Error removing user from trainer');
    }
    if (response.ok) {
      alert('User removed from trainer');
    }
    // Refresh assigned users after removing
    fetchAssignedUsers();
  }

    async function fetchAssignedUsers() {
      const res = await fetch(`${API_URL}/trainer/users/assigned`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        assignedUsers = await res.json();
      }
    }

</script>

<div class="paper-container">
  <div class="paper">
    <div class="paper-title">Search for users</div>
    <div class="paper-content">
      <input 
        type="text" 
        class="textfield" 
        bind:value={query} 
        placeholder="Label"
      />
      <p class="helper-text">Helper Text</p>
    </div>
  </div>
  <pre class="status">Searching for: {query}</pre>
</div>

<table aria-label="User list">
  <thead>
    <tr>
      <th>Name <i class="material-icons">arrow_upward</i></th>
      <th>Username <i class="material-icons">arrow_upward</i></th>
      <th>Email <i class="material-icons">arrow_upward</i></th>
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
          {#if assignedUsers.some(trainerUser => trainerUser.id === item.id)}
            <button class="remove-button" on:click={() => removeUserFromTrainer(item.id)}>Remove User</button>
          {:else}
            <button class="add-button" on:click={() => addUserToTrainer(item.id)}>Add User</button>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  /* for search */
  .paper-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .paper {
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    width: 90%

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
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  .helper-text {
    font-size: 0.8rem;
    color: #666;
    margin-top: 5px;
  }

  .status {
    font-size: 0.8rem;
    color: #666;
    text-align: center;
  }

  /* for table */
  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    cursor: pointer;
  }

  th i {
    vertical-align: middle;
    font-size: 16px;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  button {
    padding: 8px 16px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }

  .add-button {
    background-color: #007bff;
    color: #fff;
  }

  .add-button:hover {
    background-color: #0056b3;
  }

  .remove-button {
    background-color: #ff4d4d; /* Red color */
    color: #fff;
  }

  .remove-button:hover {
    background-color: #ff3333; /* Darker red on hover */
  }
</style>
