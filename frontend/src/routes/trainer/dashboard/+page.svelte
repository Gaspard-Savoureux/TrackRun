<script lang="ts">
  import DataTable, { Head, Body, Row, Cell, Label, SortValue} from '@smui/data-table';
  import IconButton from '@smui/icon-button';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Button from '@smui/button';
  import Paper, { Title, Content } from '@smui/paper';
  import type { PageData } from './$types';
  import type { User } from '$lib/types/user';
  import { API_URL } from '../../../constants';
  import { onMount } from 'svelte';

  // export let data: PageData;
  // $: ({ users } = data);

  let assignedUsers: User[] = [];

  // For sorting the list 
  let sort: keyof User = 'username';
  let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';
  // Sort the users list
  function handleSort() {
    assignedUsers.sort((a: User, b: User) => {
      const [aVal, bVal] = [a[sort], b[sort]][
        sortDirection === 'ascending' ? 'slice' : 'reverse'
      ]();
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return Number(aVal) - Number(bVal);
    });
    assignedUsers = assignedUsers;
  }

  async function addUserToTrainer(id: number) {
    const response = await fetch(`${API_URL}/trainer/user/${id}`, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.status === 409) {
      alert('User already assigned to trainer');
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
      alert('User not assigned to trainer');
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

  onMount(fetchAssignedUsers);
</script>

<div class="paper-container">

  <Paper>
    <Title>Assigned Users</Title>
  </Paper>
</div>

<DataTable
  sortable
  bind:sort
  bind:sortDirection
  on:SMUIDataTable:sorted={handleSort}
  table$aria-label="User list"
  style="width: 100%;">
  <Head>
    <Row>
      <Cell columnId="name">
        <Label>Name</Label>
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <Cell columnId="username">
        <Label>Username</Label>
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <Cell columnId="email">
        <Label>Email</Label>
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <Cell columnId="add">
        <Label></Label>
      </Cell>
    </Row>
  </Head>
  <Body>
    {#each assignedUsers as item (item.id)}
      <Row>
        <Cell>{item.name}</Cell>
        <Cell>{item.username}</Cell>
        <Cell>{item.email}</Cell>
        <Cell>
          <Button on:click={() => removeUserFromTrainer(item.id)}>Remove</Button>
        </Cell>
      </Row>
    {/each}
  </Body>
</DataTable>

<style>

</style>
