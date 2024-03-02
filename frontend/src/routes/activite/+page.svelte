<script lang="ts">
    interface Activite {
      nom: string;
      distance: string;
      duree: string;
      date: string;
    }
  
    // Utilise `const` ici car `activites` n'est pas réassignée, seulement modifiée.
    const activites: Activite[] = [];
    let nom = '';
    let distance = '';
    let duree = '';
    let date = '';
  
    function ajouterActivite() {
      console.log({ nom, distance, duree, date }); // Pour déboguer
      activites.push({ nom, distance, duree, date });
      nom = distance = duree = date = ''; // Réinitialise les champs après l'ajout
    }

    </script>

<form on:submit|preventDefault={ajouterActivite}>
    <label for="nom">Nom de l'activité:</label>
    <input id="nom" type="text" bind:value={nom} required>
  
    <label for="distance">Distance:</label>
    <input id="distance" type="text" bind:value={distance} required>
  
    <label for="duree">Durée:</label>
    <input id="duree" type="text" bind:value={duree} required>
  
    <label for="date">Date:</label>
    <input id="date" type="date" bind:value={date} required>
  
    <button type="submit">Ajouter l'activité</button>
  </form>
  
  {#if activites.length > 0}
    <h2>Activités enregistrées</h2>
    {#each activites as activite}
      <div class="activite">
        <h3>{activite.nom}</h3>
        <p>Distance: {activite.distance}</p>
        <p>Durée: {activite.duree}</p>
        <p>Date: {activite.date}</p>
      </div>
    {/each}
  {:else}
    <p>Aucune activité enregistrée pour le moment.</p>
  {/if}
