<script lang="ts">
  import Modal from '$lib/components/informative-modal.svelte';
  import { ActivityIcon, HeartIcon } from 'svelte-feather-icons';
  import { isTrainer } from '$lib/stores/trainer';
</script>

{#if $isTrainer}
  <Modal href="trainer/dashboard">
    <div class="nav-item">
      <HeartIcon />
      <p>Dashboard
      </p>
    </div>
  </Modal>
{:else}
  <Modal href="/activity">
    <div class="nav-item">
      <ActivityIcon />
      <p>Activities</p>
    </div>
  </Modal>
{/if}


<style>
  .nav-item {
    padding: 1rem;
    color: var(--text);
    background-color: var(--bg-3);
    display: flex;
  }

  p {
    position: relative;
    margin-left: 1rem;
  }
</style>
