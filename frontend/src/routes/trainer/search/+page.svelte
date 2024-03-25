<script lang="ts">
  import DataTable, {
    Head,
    Body,
    Row,
    Cell,
    Label,
    SortValue,
  } from '@smui/data-table';
  import IconButton from '@smui/icon-button';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import type { PageData } from './$types';
  import type { User } from '$lib/types/user';

  export let data: PageData;
  $: ({ users } = data);

  let query = '';

  let sort: keyof User = 'username';
  let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';


  function handleSort() {
    users.sort((a: User, b: User) => {
      const [aVal, bVal] = [a[sort], b[sort]][
        sortDirection === 'ascending' ? 'slice' : 'reverse'
      ]();
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return Number(aVal) - Number(bVal);
    });
    users = users;
  }




  $: filteredUsers = users.filter((user: User) => {
    return user.username.toLowerCase().includes(query.toLowerCase());
  });
</script>

<div>
  <Textfield
    class="shaped-outlined"
    variant="outlined"
    bind:value={query}
    label="Label"
  >
    <HelperText slot="helper">Helper Text</HelperText>
  </Textfield>

  <pre class="status">Value: {query}</pre>
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
        <!-- For non-numeric columns, icon comes second. -->
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
    </Row>
  </Head>
  <Body>
    {#each filteredUsers as item (item.id)}
      <Row>
        <Cell>{item.name}</Cell>
        <Cell>{item.username}</Cell>
        <Cell>{item.email}</Cell>
      </Row>
    {/each}
  </Body>
</DataTable>

