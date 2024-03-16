<script lang="ts">
  import { getFormatDate, getFormatDuration } from '$lib/plannedActivity/activity';
  export let data;
  $: ({ plannedActivity } = data);

  function deleteActivity() {
    return;
  }
  function modifyActivity() {
    return;
  }
</script>

<article class="activity-container">
  <div class="activity-info">
    <h1>Activity : {plannedActivity.name}</h1>
    <p>Type : {plannedActivity.type}</p>
    <p>Durée : {getFormatDuration(plannedActivity.duration)}</p>
    <p>Date : {getFormatDate(plannedActivity.date)}</p>
    {#if plannedActivity.comment}
      <p>Commentaire : {plannedActivity.comment}</p>
    {/if}
  </div>

  <div class="activity-actions">
    <button class="action-btn" on:click={modifyActivity}>Modifier</button>
    <button class="action-btn" on:click={deleteActivity}>Supprimer</button>
  </div>
</article>

<style>
  .activity-container {
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .activity-actions {
    display: flex;
    padding: 10px;
    gap: 10px;
  }

  .action-btn {
    padding: 6px 12px;
    margin-bottom: 5px;
    background-color: #555;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
