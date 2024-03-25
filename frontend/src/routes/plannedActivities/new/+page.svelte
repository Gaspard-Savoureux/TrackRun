<script lang="ts">
  import { enhance } from '$app/forms';
  import { activityType } from '$lib/plannedActivity/activity.js';
  
  export let form;
</script>

<svelte:head>
  <title>Create Planned Activity</title>
</svelte:head>

<style>
  form ,.submit-box{
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

  button, .btn {
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

<body>
  <h2 class="header">Plan a new activity</h2>
    {#if form?.submitted}
      <div class=submit-box>
        <h3>Activity planned!</h3>
        <a class="btn" href="/plannedActivity?id={form?.id}">See planned activity</a>
      </div> 
    {:else}
      <form method="POST" use:enhance>
      <label for="type">Type<span class="danger">*</span></label>
      <select id="type" name="type">
        {#each activityType as type}
          <option value={type}>{type}</option>
        {/each}
        </select>

      <label for="date">Date<span class="danger">*</span></label>
      <input id="date" type="date" name="date"/>

      <label for="time">Time<span class="danger">*</span></label>
      <input id="time" type="time" name="time" step="1"/>

      <label for="duration">Duration (in minutes)<span class="danger">*</span></label>
      <input id="duration" type="number" name="duration" min="1"/>

      <label for="name">Name</label>
      <input id="name" name="name"/>

      <label for="comment">Comment</label>
      <textarea id="comment" name="comment"></textarea>
      {#if form?.success === false}
        <p class="danger">{form?.message}</p>
      {/if}
    <button type="submit">Submit</button>
  </form>
  {/if}
</body>
