<script lang="ts">
  import Modal from '$lib/components/informative-modal.svelte';
  import { ActivityIcon, UserIcon, ListIcon, BarChartIcon } from 'svelte-feather-icons';
  import { isTrainer } from '$lib/stores/trainer';
</script>

{#if $isTrainer}
  <Modal href="/trainer/client">
    <div class="nav-item">
      <UserIcon />
      <p>Clients</p>
    </div>
  </Modal>
{:else}
  <Modal href="/activity">
    <div class="nav-item">
      <ActivityIcon />
      <p>Activities</p>
    </div>
  </Modal>
  <Modal href="/plannedActivities">
    <div class="nav-item">
      <ListIcon />
      <p>Planned Activities</p>
    </div>
  </Modal>
  <Modal href="/statistics">
    <div class="nav-item">
      <BarChartIcon />
      <p>Statistics</p>
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
