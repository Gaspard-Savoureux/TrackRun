<script lang="ts">
  import type { User } from '$lib/types/user';
  import { UserIcon } from 'svelte-feather-icons';

  export let user: User;
</script>

<div class="user-card" style="--background-image: url({user.img});">
  <div class="background-shroud">
    <div class="user-card-values">
      <div class="img-container">
        {#if user.img}
          <img src={`${user.img}`} alt="profile" />
        {:else}
          <!-- <img src={`${user.img}`} alt="profile" /> -->
          <span class="user-icon">
            <UserIcon size="100" />
          </span>
        {/if}
      </div>
      <hr />
      <div class="name">{user?.name}</div>
      <div class="username">{user?.username}</div>
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
    height: 100%;
    background: var(--bg-2);
    transition: var(--transition-delay);
  }

  .user-card:hover .background-shroud {
    background: var(--shroud);
  }

  .user-card-values {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem;
    background: linear-gradient(transparent 0%, var(--bg-2) 100%);
  }

  .img-container {
    display: flex;
    align-self: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 50%;
    max-height: 100%;
    max-width: 100%;
    aspect-ratio: 1 / 1;
    transition: var(--transition-delay);
  }

  .user-card:hover .img-container {
    height: 0;
  }

  img {
    height: 100%;
    object-fit: cover;
    transition: var(--transition-delay);
  }

  .expand {
    display: none;
    /* height: 0; */
    padding: 0;
    transition: var(--transition-delay);
    transition-delay: padding var(--transition-delay);
    overflow: hidden;
    filter: opacity(0);
  }

  .user-card:hover .expand {
    display: block;
    /* height: 100%; */
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
    flex-shrink: 0;
    font-size: 2rem;
    font-weight: bold;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-card:hover .name {
    /* height: 100%; */
    /* overflow-x: auto; */
    /* text-overflow: initial; */
    /* white-space: initial; */
  }

  .username {
    flex-shrink: 0;
    font-size: 1.5rem;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
