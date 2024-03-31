<script lang="ts">
  import type { User } from '$lib/types/user';

  export let user: User;
</script>

<div class="user-card">
  <div class="user-card-values">
    <div class="img-container">
      {#if user?.img}
        <img src={user.img} alt="profile" />
      {:else}
        <img src="question-mark.png" alt="profile" />
      {/if}
    </div>
    <hr />
    <div class="name">{user?.name}</div>
    <div class="username">{user?.username}</div>
  </div>
</div>

<style>
  .user-card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border-radius: var(--box-rounded);
    background: var(--bg-2);
  }

  .user-card-values {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem;
  }

  .img-container {
    display: flex;
    align-self: center;
    overflow: hidden;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
  }

  hr {
    margin: 1rem 0;
  }

  .name {
    flex-shrink: 0;
    font-size: 2rem;
    font-weight: bold;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .username {
    flex-shrink: 0;
    font-size: 1.5rem;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-light);
  }
</style>
