<script lang="ts">
/*   import { page } from '$app/stores';
  let type = 'Running'; // Default selection
  let date = '';
  let durationInMinutes = 0;
  let name = '';
  let comment = ''; */
  import { enhance } from '$app/forms';

  export let form;

/*
  function handleSubmission() {
    submitted = true;
    //setTimeout(() => submitted = false, 3000); // Reset after 3 seconds
  }
*/
</script>

<svelte:head>
  <title>Create Planned Activity</title>
</svelte:head>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 400px;
    margin: auto;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  label {
    font-size: 16px;
    color: #333;
  }

  input, select, textarea {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 16px;
  }

  button {
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  button:hover {
    background-color: #0056b3;
  }

  .header {
    text-align: center;
    font-family: "Montserrat", sans-serif;
    margin: 15px;
  }
</style>

<h2 class="header">Plan a new activity</h2>

  <form method="POST" use:enhance>
  <label for="type">Type<span class="danger">*</span></label>
  <select id="type" name="type">
    <option value="Running">Running</option>
    <option value="Biking">Biking</option>
    <option value="Walking">Walking</option>
  </select>

  <label for="date">Date<span class="danger">*</span></label>
  <input id="date" type="date" name="date"/>

  <label for="duration">Duration (in minutes)<span class="danger">*</span></label>
  <input id="duration" type="number" name="duration"/>

  <label for="name">Name</label>
  <input id="name" name="name" />

  <label for="comment">Comment</label>
  <textarea id="comment" name="comment"></textarea>

  {#if form?.success === false}
    <p class="danger">{form?.message}</p>
  {:else if form?.success === true}
    <p>Activity planned!</p>
    <a href="/plannedActivities">See planned activity [ADD URL WITH ID]</a>
  {/if}

  <button type="submit">Submit</button>
</form>
