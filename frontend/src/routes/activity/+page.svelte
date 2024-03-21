<script lang="ts">
  import GPXForm from './GPXForm.svelte';
  import ManuelForm from './ManuelForm.svelte';

  let afficherManuelForm = false;
  let afficherGPXForm = false;

  function afficherManuel() {
    afficherManuelForm = true;
    afficherGPXForm = false;
  }

  function afficherGPX() {
    afficherManuelForm = false;
    afficherGPXForm = true;
  }
  export let form: { success?: boolean, message?: string } = {};

  export let data;
  const activities = data.activities.userActivities;

  function confirmerEtModifier(event: SubmitEvent) {
    const isConfirmed = confirm('Êtes-vous sûr de vouloir modifier cette activité ?');
    if (!isConfirmed) {
      event.preventDefault();
    }

  }

  function confirmerEtSupprimer(event: SubmitEvent) {
    const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer cette activité ?');
    if (!isConfirmed) {
      event.preventDefault();
    }

  }


</script>

<h1>Page d'activiter</h1>
<p>Choisiser votre formulaire</p>

<button on:click={afficherManuel}>Enregistrement Manuel</button>
<button on:click={afficherGPX}>Enregistrement GPX</button>

{#if afficherManuelForm}
  <ManuelForm />
{/if}

{#if afficherGPXForm}
  <GPXForm />
{/if}

{#if form?.success === false}<p class="danger">{form?.message}</p>{/if}

{#if activities.length > 0}
  <h2>Activités enregistrées</h2>
  {#each activities as activity}
    <div class="activity">
      <h3>{activity.name}</h3>
      <p>Distance: {activity.distanceTotal}</p>
      <p>Durée: {activity.durationTotal}</p>
      <p>Date: {activity.date}</p>
      <div class="options">
        <form on:submit|preventDefault={confirmerEtModifier} method="POST" action="?/modifierActivite">
          <input type="hidden" name="activityId" value="{activity.id}">
          <input type="hidden" name="name" value="{activity.name}">
          <input type="hidden" name="city" value="{activity.city}">
          <input type="hidden" name="type" value="{activity.type}">
          <input type="hidden" name="date" value="{activity.date}">
          <input type="hidden" name="durationTotal" value="{activity.durationTotal}">
          <input type="hidden" name="distanceTotal" value="{activity.distanceTotal}">
          <input type="hidden" name="comment" value="{activity.comment}">

          <button type="submit">Modifier</button>
        </form>
        <form on:submit|preventDefault={confirmerEtSupprimer} method="POST" action="?/supprimerActivite">
          <input type="hidden" name="activityId" value="{activity.id}">
          <button type="submit">Supprimer</button>
        </form>
      </div>
    </div>
  {/each}
{:else}
  <p>Aucune activité enregistrée pour le moment.</p>
{/if}

<style>
  .options {
    display: flex;
  }

  .options button {
    margin-right: 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

</style>

