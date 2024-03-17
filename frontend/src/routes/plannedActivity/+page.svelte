<script lang="ts">
  export let data;
  import { enhance } from '$app/forms';
  export let form;
  export let deleteMsg;

  $: ({ plannedActivity } = data);
  $: duration = Math.floor(plannedActivity.duration / 60);

  /* TODO: use this when date is fixed to right format
   * (right timezone and formated as YYYY-MM-DD hh:mm:ss)
   * $: date = plannedActivity.date.split(' ')[0];
   * $: time = plannedActivity.date.split(' ')[1];
   */
  $: date = plannedActivity.date.split('T')[0];
  $: time = plannedActivity.date.split('T')[1].substring(0, 8);

  const activityType = ['Running', 'Biking', 'Walking'];
</script>

<svelte:head>
  <title>Planned activity</title>
</svelte:head>

<h2 class="header">Planned activity</h2>

<!-- TODO: if real activity is linked, do not allow modification-->

{#if $deleteMsg}
  <p>Deletion successfull. Redirecting now</p>
{/if}

<section>
  <div class="activity-info">
    {#if form?.deleted === false}
      <div class="submit-box">
        <p class="danger">{form?.message}</p>
        <a class="btn" href="/plannedActivities">Back to planned activities</a>
      </div>
    {:else if form?.deleted === true}
      <div class="submit-box">
        <h3>{form?.message}</h3>
        <a class="btn" href="/plannedActivities">See planned activities</a>
      </div>
    {:else}
      <form method="POST" action="?/save" use:enhance>
        <input hidden name="id" value={plannedActivity.id} />
        <label for="type">Type<span class="danger">*</span></label>
        <select id="type" name="type">
          {#each activityType as type}
            {#if type === plannedActivity.type}
              <option selected value={type}>{type}</option>
            {:else}
              <option value={type}>{type}</option>
            {/if}
          {/each}
        </select>

        <label for="date">Date<span class="danger">*</span></label>
        <input id="date" type="date" name="date" value={date ?? ''} />

        <label for="time">Time<span class="danger">*</span></label>
        <input id="time" type="time" name="time" step="1" value={time ?? ''} />

        <label for="duration">Duration (in minutes)<span class="danger">*</span></label>
        <input id="duration" type="number" name="duration" min="1" value={duration ?? ''} />

        <label for="name">Name</label>
        <input id="name" name="name" value={plannedActivity.name ?? ''} />

        <label for="comment">Comment</label>
        <textarea id="comment" name="comment" value={plannedActivity.comment ?? ''}></textarea>

        {#if form?.updated === false}
          <p class="danger">{form?.message}</p>
        {:else if form?.updated === true}
          <p class="success">{form?.message}</p>
        {/if}

        <button type="submit">Save</button>
        <button formaction="?/delete" class="btn-danger">Delete</button>
      </form>
    {/if}
  </div>
</section>

<style>
  form,
  .submit-box {
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

  input,
  select,
  textarea {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 16px;
  }

  .success {
    color: #007bff;
  }

  button,
  .btn {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  button:hover {
    background-color: #0056b3;
  }

  .btn-danger {
    background-color: var(--danger);
  }

  .btn-danger:hover {
    background-color: color-mix(in srgb, var(--danger), #000 15%);
  }

  .header {
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    margin: 15px;
  }
</style>
