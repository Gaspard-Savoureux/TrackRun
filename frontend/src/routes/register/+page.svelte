<script lang="ts">
  import { enhance } from '$app/forms';

  export let form;
</script>

<form method="POST" action="?/register" use:enhance>
  {#if form?.success === false}<p>{form?.message}</p>{/if}

  <label>
    Nom d'utilisateur
    <input type="text" name="username" value={form?.username ?? ''} />
  </label>

  <label>
    Courriel
    <input type="email" name="email" value={form?.email ?? ''} />
  </label>

  <label>
    Mot de passe
    <input type="password" name="password" />
  </label>

  <label>
    Nom
    <input type="text" name="lastname" value={form?.lastname ?? ''} />
  </label>

  <label>
    Prénom
    <input type="text" name="firstname" value={form?.firstname ?? ''} />
  </label>

  <label>
    Date de naissance
    <input type="date" name="birthdate" value={form?.birthdate ?? ''} />
  </label>

  <button>S'inscrire</button>
  <a href="/login">Se connecter</a>
</form>
