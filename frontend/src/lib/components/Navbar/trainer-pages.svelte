<script lang="ts">
  import Modal from '$lib/components/informative-modal.svelte';
  import { UsersIcon } from 'svelte-feather-icons';
</script>

<Modal href="/trainer/clients">
  <div class="nav-item">
    <UsersIcon />
    <p>Clients</p>
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
