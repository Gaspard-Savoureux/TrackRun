<script lang="ts">
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
  
    function ajouterActivite() {
      console.log({ nom, ville, typeActivite, date, duree, distance, comment}); // Pour déboguer
      activites.push({ nom, ville, typeActivite, date, duree, distance, comment });
      nom = ville = date = duree = distance = comment = ''; // Réinitialise les champs après l'ajout
      typeActivite = 'Course';
    }

    </script>

<form on:submit|preventDefault={ajouterActivite}>
    <label for="nom">Nom de l'activité:</label>
    <input id="nom" type="text" bind:value={nom} required>

    <label for="ville">Ville:</label>
    <input id="ville" type="text" bind:value={ville} required>
  
    <label for="typeActivite">Type d'activité:</label>
    <select id="typeActivite" bind:value={typeActivite} required>
      <option value="Course">Course</option>
      <option value="Vélo">Vélo</option>
    </select>

    <label for="date">Date:</label>
    <input id="date" type="date" bind:value={date} required>
  
    <label for="duree">Durée:</label>
    <input id="duree" type="text" bind:value={duree} required>

    <label for="distance">Distance:</label>
    <input id="distance" type="text" bind:value={distance} required>

    <label for="comment">Commentaires:</label>
    <input id="comment" type="text" bind:value={comment} required>
  
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
