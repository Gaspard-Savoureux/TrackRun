<script lang="ts">
  import { enhance } from '$app/forms';
  import { activityType, getISOFromDate, get24hFormatFromDate } from '$lib/plannedActivity/activity.js';

  export let form;
  export let data;
  export let deleteMsg;

  $: ({ plannedActivity } = data);  
  $: prev_date = new Date(plannedActivity.date);
  $: date = getISOFromDate(prev_date);
  $: time = get24hFormatFromDate(prev_date);
  $: duration = Math.floor(plannedActivity.duration / 60);

  let dialog;

  function confirmDelete() {
    document.querySelector('form').action = '?/delete';
    document.querySelector('form').submit();
  }
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
        <input id="time" type="time" name="time" step="60" value={time ?? ''} />

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
        <button on:click={() => dialog.showModal()} type="button" class="btn-danger">Delete</button>
      </form>
    {/if}
  </div>
  <dialog bind:this={dialog}>
    <h1>Are you sure you want to delete this planned activity?</h1>
    <div class="dialog-buttons">
      <button on:click={confirmDelete} type="button" class="btn-danger">Confirm</button>
      <button on:click={() => dialog.close()}>Cancel</button>
    </div>
  </dialog>
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

  .dialog-buttons {
    padding-top: 20px;
    text-align: end;
  }

  .header {
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    margin: 15px;
  }
</style>
