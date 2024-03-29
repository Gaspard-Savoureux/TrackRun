<script lang="ts">
  import Modal from '$lib/components/informative-modal.svelte';
  import { ActivityIcon, ListIcon, BarChartIcon } from 'svelte-feather-icons';
</script>

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
