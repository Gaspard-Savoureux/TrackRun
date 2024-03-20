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

    export let data;
    const activities = data.activities.userActivities;
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

<form method="POST">
  <input type="hidden" name="_action" value="supprimerActivite">
  <input type="hidden" name="activityId" value="{activities.activityId}">
  <button type="submit">Supprimer</button>
</form>


  {#if activities.length > 0}
    <h2>Activités enregistrées</h2>
    {#each activities as activity}
      <div class="activity">
        <h3>{activity.name}</h3>
        <p>Distance: {activity.distanceTotal}</p>
        <p>Durée: {activity.durationTotal}</p>
        <p>Date: {activity.date}</p>
        <div class="options">
          <button class="modifier">Modifier</button>
          <button class="supprimer" >Supprimer</button>
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

    .options .modifier {
        background-color: #007bff;
        color: #fff;
    }

    .options .supprimer {
        background-color: #dc3545;
        color: #fff;
    }
</style>
