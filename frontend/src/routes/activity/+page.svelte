<script lang="ts">
    import { enhance } from '$app/forms';

    export let data;
    const activities = data.activities.userActivities;

    let nom = '';
    let ville = '';
    let typeActivite: 'Course' | 'Vélo' = 'Course';
    let date = '';
    let duree = '';
    let distance = '';
    let comment = '';

    export let form;
    </script>

<form method="POST" action="?/ajouterActivite" use:enhance>
    <label for="nom">Nom de l'activité:</label>
    <input name="nom" type="text" bind:value={nom} required>

    <label for="ville">Ville:</label>
    <input name="ville" type="text" bind:value={ville} required>
  
    <label for="typeActivite">Type d'activité:</label>
    <select name="typeActivite" bind:value={typeActivite} required>
      <option value="Running">Running</option>
      <option value="Biking">Biking</option>
      <option value="Walking">Walking</option>
    </select>

    <label for="date">Date:</label>
    <input name="date" type="date" bind:value={date} required>
  
    <label for="duree">Durée:</label>
    <input name="duree" type="text" bind:value={duree} required>

    <label for="distance">Distance:</label>
    <input name="distance" type="text" bind:value={distance} required>

    <label for="comment">Commentaires:</label>
    <input name="comment" type="text" bind:value={comment} required>
    {#if form?.success === false}<p class="danger">{form?.message}</p>{/if}
    <button class="link" type="submit">Ajouter l'activité</button>
  </form>

  {#if activities.length > 0}
    <h2>Activités enregistrées</h2>
    {#each activities as activity}
      <div class="activity">
        <h3>{activity.name}</h3>
        <p>Distance: {activity.distanceTotal}</p>
        <p>Durée: {activity.durationTotal}</p>
        <p>Date: {activity.date}</p>
      </div>
    {/each}
  {:else}
    <p>Aucune activité enregistrée pour le moment.</p>
  {/if}
