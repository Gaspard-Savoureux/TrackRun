<script lang="ts">
  import type { User } from '$lib/types/user';
  import { UserIcon } from 'svelte-feather-icons';

  export let user: User;
</script>

<div class="user-card" style="--background-image: url({user.img});">
  <div class="background-shroud">
    <div class="user-card-values">
      {#if user.img}
        <img src={`${user.img}`} alt="profile" />
      {:else}
        <!-- <img src={`${user.img}`} alt="profile" /> -->
        <span class="user-icon">
          <UserIcon size="100" />
        </span>
      {/if}
      <hr />
      <span class="name">{user?.name}</span>
      <span class="username">{user?.username}</span>
      <div class="expand">
        <div class="user-info">
          <strong>Age</strong>
          <span>{user?.age}</span>
        </div>
        <div class="user-info">
          <strong>Height</strong>
          <span class="user-height">{user?.height}</span>
        </div>
        <div class="user-info">
          <strong>Weight</strong>
          <span class="user-weight">{user?.weight}</span>
        </div>
        <div class="user-info">
          <strong>Email</strong>
          <span>{user?.email}</span>
        </div>
        <div class="user-info">
          <strong>Sex</strong>
          <span>{user?.sex}</span>
        </div>
        <p class="user-description">
          {user?.description}
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  :root {
    --transition-delay: 0.3s;
  }

  .user-card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
    height: 25.2rem;
    background: var(--background-image) center;
    background-size: cover;
  }

  .background-shroud {
    background: var(--bg-2);
    transition: var(--transition-delay);
  }

  .user-card:hover .background-shroud {
    background: var(--shroud);
  }

  .user-card-values {
    display: flex;
    flex-direction: column;
    height: 23.2rem;
    padding: 1rem;
    background: linear-gradient(transparent 0%, var(--bg-2) 100%);
  }

  img {
    align-self: center;
    border-radius: 10rem;
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: var(--transition-delay);
  }

  .user-card:hover img {
    height: 0;
  }

  .expand {
    height: 0;
    padding: 0;
    transition: var(--transition-delay);
    transition-delay: padding var(--transition-delay);
    overflow: hidden;
    filter: opacity(0);
  }

  .user-card:hover .expand {
    height: 100%;
    padding: 1rem 0 0 0;
    filter: opacity(1);
  }

  hr {
    margin: 1rem 0;
    transition: var(--transition-delay);
  }

  .user-card:hover hr {
    margin: 0;
    border-color: transparent;
  }

  .name {
    font-size: 2rem;
    font-weight: bold;
  }

  .username {
    font-size: 1.5rem;
    color: var(--text-light);
    transition: var(--transition-delay);
  }

  .user-card:hover .username {
    color: var(--text);
  }

  .user-height::after {
    content: 'cm';
    color: var(--text-light);
    margin-left: 0.1rem;
  }

  .user-weight::after {
    content: 'kg';
    color: var(--text-light);
    margin-left: 0.1rem;
  }

  .user-description {
    padding-top: 0.5rem;
  }
</style>
