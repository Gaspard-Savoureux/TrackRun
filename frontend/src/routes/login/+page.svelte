<script lang="ts">
  import { enhance } from '$app/forms';

  export let form;
</script>

<form method="POST" action="?/login" use:enhance>
  {#if form?.success === false}<p>{form?.message}</p>{/if}
  <label>
    Username
    <input type="text" name="username" value={form?.username ?? ''} />
  </label>
  <label>
    Password
    <input type="password" name="password" />
  </label>
  <button>Log in</button>
  <a href="/register">Register</a>
</form>
