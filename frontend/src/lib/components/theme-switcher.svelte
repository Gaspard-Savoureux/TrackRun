<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import type { FormEventHandler } from 'svelte/elements';

  const handleChange: FormEventHandler<HTMLSelectElement> = (event) => {
    document.cookie = `theme=${event.currentTarget.value}; path=/; SameSite=Lax`;
  };
</script>

<select on:change={handleChange} bind:value={$theme}>
  <option value="system">System</option>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
</select>
