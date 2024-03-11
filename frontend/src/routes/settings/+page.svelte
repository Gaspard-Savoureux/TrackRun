<script lang="ts">
  import ThemeSwitcher from "$lib/components/theme-switcher.svelte";


</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<section>
  <h1>Update user profile</h1>
  <form method="PUT">
    <label>
      Username
      <input type="text" name="username" />
    </label>
    <label>
      Password
      <input type="password" name="password" />
    </label>
    <label>
      Age
      <input type="text" name="age" />
    </label>
    <label>
      Height
      <input type="text" name="height" />
    </label>
    <label>
      Weight
      <input type="text" name="weight" />
    </label>
    <button type="submit">Update</button>
    <a href="/profile">Cancel</a>
  </form>
  <ThemeSwitcher />
  <a href="/logout">logout</a>
</section>

<style>

</style>
