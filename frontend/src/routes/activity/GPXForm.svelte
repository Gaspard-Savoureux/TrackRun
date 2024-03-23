<script lang="ts">
  import { enhance } from '$app/forms';

  let name = '';
  let typeActivite: 'Running' | 'Biking' | 'Walking' = 'Running';
  let fichierGPX: FileList  | null = null;
  let comment = '';

</script>

<form method="POST" action="?/ajouterActiviteGPX" use:enhance enctype="multipart/form-data">
  <label for="name">Nom de l'activité:</label>
  <input name="name" type="text" bind:value={name} required>

  <label for="typeActivite">Type d'activité:</label>
  <select name="typeActivite" bind:value={typeActivite} required>
      <option value="Running">Running</option>
      <option value="Biking">Biking</option>
      <option value="Walking">Walking</option>
  </select>

  <label for="fichierGPX">Fichier GPX:</label>
  <input name="fichierGPX" type="file" accept=".gpx" bind:files={fichierGPX} required>

  <label for="comment">Commentaires:</label>
  <textarea name="comment" bind:value={comment} required></textarea>

  <button class="link" type="submit">Ajouter l'activité</button>
</form>
