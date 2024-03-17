<script lang="ts">
  import { enhance } from '$app/forms';

  let nom = '';
  let typeActivite: 'Running' | 'Biking' | 'Walking' = 'Running';
  let fichierGPX: File | null = null;
  let commentaires = '';

  export let form: { success?: boolean, message?: string } = {};
</script>

<form method="POST" action="?/ajouterActiviteGPX" use:enhance>
  <label for="nom">Nom de l'activité:</label>
  <input name="nom" type="text" bind:value={nom} required>

  <label for="typeActivite">Type d'activité:</label>
  <select name="typeActivite" bind:value={typeActivite} required>
      <option value="Running">Running</option>
      <option value="Biking">Biking</option>
      <option value="Walking">Walking</option>
  </select>

  <label for="fichierGPX">Fichier GPX:</label>
  <input name="fichierGPX" type="file" accept=".gpx" bind:files={fichierGPX} required>

  <label for="commentaires">Commentaires:</label>
  <textarea name="commentaires" bind:value={commentaires} required></textarea>

  {#if form?.success === false}<p class="danger">{form?.message}</p>{/if}
  <button class="link" type="submit">Ajouter l'activité</button>
</form>
