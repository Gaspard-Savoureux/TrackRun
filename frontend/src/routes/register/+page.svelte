<script lang="ts">
  import { enhance } from "$app/forms";
  import { writable, derived } from 'svelte/store';

  let form = writable({
    username: '',
    email: '',
    password: '',
    lastname: '',
    firstname: '',
    birthdate: ''
  });

  let usernameError = writable('');
  let emailError = writable('');
  let passwordError = writable('');
  let lastnameError = writable('');
  let firstnameError = writable('');
  let birthdateError = writable('');

  function validateUsername(value: string) {
    if (value.length < 3) usernameError.set('Le nom d\'utilisateur doit contenir au moins 3 caractères.');
    else usernameError.set('');
  }

  function validateEmail(value: string) {
    if (!/\S+@\S+\.\S+/.test(value)) emailError.set('L\'email n\'est pas valide.');
    else emailError.set('');
  }

  function validatePassword(value: string) {
    if (value.length < 6) passwordError.set('Le mot de passe doit contenir au moins 6 caractères.');
    else passwordError.set('');
  }

  function validateName(value: string, error) {
    if (value.length === 0) error.set('Ce champ ne peut pas être vide.');
    else error.set('');
  }

  function validateDate(value: string) {
    if (value === '') birthdateError.set('La date de naissance est requise.');
    else birthdateError.set('');
  }

  let isFormValid = derived(
    [usernameError, emailError, passwordError, lastnameError, firstnameError],
    ($usernameError, $emailError, $passwordError, $lastnameError, $firstnameError) =>
      $usernameError === '' && $emailError === '' && $passwordError === '' && $lastnameError === '' && $firstnameError === ''
  );
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>

<div class="container">
  <form method="POST" action="?/register" use:enhance>
    {#if form?.success === false}<p>{form?.message}</p>{/if}

    <label>
      Nom d'utilisateur
      <input type="text" name="username" bind:value={$form.username} on:blur={(e) => validateUsername(e.target.value)} />
      {#if $usernameError}<p class="error">{$usernameError}</p>{/if}
    </label>
    
    <label>
      Courriel
      <input type="email" name="email" bind:value={$form.email} on:blur={(e) => validateEmail(e.target.value)} />
      {#if $emailError}<p class="error">{$emailError}</p>{/if}
    </label>

    <label>
      Mot de passe
      <input type="password" name="password" bind:value={$form.password} on:blur={(e) => validatePassword(e.target.value)} />
      {#if $passwordError}<p class="error">{$passwordError}</p>{/if}
    </label>

    <label>
      Nom
      <input type="text" name="lastname" bind:value={$form.lastname} on:blur={(e) => validateName(e.target.value, lastnameError)} />
      {#if $lastnameError}<p class="error">{$lastnameError}</p>{/if}
    </label>

    <label>
      Prénom
      <input type="text" name="firstname" bind:value={$form.firstname} on:blur={(e) => validateName(e.target.value, firstnameError)} />
      {#if $firstnameError}<p class="error">{$firstnameError}</p>{/if}
    </label>

    <label>
      Date de naissance
      <input type="date" name="birthdate" bind:value={$form.birthdate} on:blur={(e) => validateDate(e.target.value)} />
    </label>

    <button disabled={!$isFormValid}>S'inscrire</button>
    <a href="/login">Se connecter</a>
  </form>
</div>

<style>
 

  .error {
    color: red; 
  }

  .container {
    padding: 1rem;
    max-width: 30rem;
    margin: 0 auto;
    border-radius: 0.35rem;
    background-color: var(--bg-2);
  }

  @media (width >= 500px) {
    .container {
      padding: 2rem
    }
  }

 

  form {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  input {
    font-size: 1.15rem;
    line-height: 1.5;
    box-sizing: border-box;
    display: inline-flex;
    height: 3.125rem;
    width: 100%;
    max-width: 100%;
    padding: 0.5rem 0.5rem;
    border-radius: 4px;
    border: 1px solid var(--text-light);
    background-color: inherit;
  }

  input:focus-visible {
    outline: var(--link) solid 1px;
    border-color: var(--link);
  }

  button {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-button);
    width: 100%;
    padding: 0.47em 1em;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    background-color: var(--blue);
    transition: 0.2s;
  }

  button:hover {
    background-color: var(--blue-darker);
  }

  button:disabled {
    background-color: #cccccc; 
    cursor: not-allowed;
  }
  

 
</style>

