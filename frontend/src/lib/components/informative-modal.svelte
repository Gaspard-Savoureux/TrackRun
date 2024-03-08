<script lang="ts">
  export let href = '#';
  export let info = '';
</script>

<a {href}>
  <slot />
  <div class="modal">{info}</div>
</a>

<style>
  .modal {
    position: absolute;
    text-decoration: none;
    color: var(--text);
    background-color: var(--bg-2);
    border-radius: 0.2rem;
    padding: 0.3rem;
    visibility: hidden;
  }

  a:link {
    text-decoration: none;
    color: var(--text);
  }

  a:hover > .modal {
    visibility: visible;
  }
</style>
