<script lang='ts'>
  import { enhance } from '$app/forms';
  export let form;

  let username = form?.username ?? '';
  let email = form?.email ?? '';
  let password = '';
  let lastname = form?.lastname ?? '';
  let firstname = form?.firstname ?? '';
  let birthdate = form?.birthdate ?? '';

  let errors = {};

  const validateForm = () => {
    errors = {}; 


    if (!username.trim()) errors.username = 'Le nom d\'utilisateur est requis.';


    if (!email.trim()) {
      errors.email = 'L\'adresse courriel est requise.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'L\'adresse courriel n\'est pas valide.';
    }

    if (!password.trim()) errors.password = 'Le mot de passe est requis.';


    if (!lastname.trim()) errors.lastname = 'Le nom est requis.';

    if (!firstname.trim()) errors.firstname = 'Le prénom est requis.';


    if (!birthdate.trim()) errors.birthdate = 'La date de naissance est requise.';

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

  };
</script>

<form class='container' method='POST' action='?/register' on:submit={handleSubmit} use:enhance>
  {#if form?.success === false}<p>{form?.message}</p>{/if}


  <label>
    Nom d'utilisateur
    <input type='text' name='username' bind:value={username} />
    {#if errors.username}<p style='color: red;'>{errors.username}</p>{/if}
  </label>
  
  <label>
    Courriel
    <input type='email' name='email' bind:value={email} />
    {#if errors.email}<p style='color: red;'>{errors.email}</p>{/if}
  </label>
  
  <label>
    Mot de passe
    <input type='password' name='password' bind:value={password} />
    {#if errors.password}<p style='color: red;'>{errors.password}</p>{/if}
  </label>
  
  <label>
    Nom
    <input type='text' name='lastname' bind:value={lastname} />
    {#if errors.lastname}<p style='color: red;'>{errors.lastname}</p>{/if}
  </label>
  
  <label>
    Prénom
    <input type='text' name='firstname' bind:value={firstname} />
    {#if errors.firstname}<p style='color: red;'>{errors.firstname}</p>{/if}
  </label>
  
  <label>
    Date de naissance
    <input type='date' name='birthdate' bind:value={birthdate} />
    {#if errors.birthdate}<p style='color: red;'>{errors.birthdate}</p>{/if}
  </label>  

  <button type="submit">S'inscrire</button>
  <a href="/login">Se connecter</a>
</form>

<style>

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
</style>

