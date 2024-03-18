<script lang="ts">
  import { enhance } from '$app/forms';
  

  interface Activite {
    nom: string;
    ville: string;
    typeActivite: 'Course' | 'Vélo';
    date: string;
    duree: string;
    distance: string;
    comment: string;
  }

  const activites: Activite[] = [];
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

{#if activites.length > 0}
<h2>Activités enregistrées</h2>
{#each activites as activite}
  <div class="activite">
    <h3>{activite.nom}</h3>
    <p>Distance: {activite.distance}</p>
    <p>Durée: {activite.duree}</p>
    <p>Date: {activite.date}</p><div class="options">
  <div class="options">
    <button class="modifier">Modifier</button>
    <button class="supprimer">Supprimer</button>
  </div>
</div>
  </div>
{/each}
{:else}
<p>Aucune activité enregistrée pour le moment.</p>
{/if}

<style>
  /* Styles existants */
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
