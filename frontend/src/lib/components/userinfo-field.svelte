<script lang="ts">
  import { convertNewlinesToBreaks } from '$lib/utils/textFormatting';
  import { removesHtmlTags } from '$lib/utils/xssVerification';

  export let name: string;
  export let value: unknown = undefined;
  export let lineBreaksAllowed = false;
</script>

<div class={'item'}>
  <h3>{name}</h3>
  {#if value && lineBreaksAllowed}
    <!-- Removes all html tags first, then convert newline into <br> -->
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <span>{@html convertNewlinesToBreaks(removesHtmlTags(value.toString()))}</span>
  {:else if value}
    <span>{value}</span>
  {:else}
    <span class="notset">Not specified</span>
  {/if}
</div>

<style>
  .item {
    display: flex;
    margin: 1rem;
  }

  span {
    align-self: center;
  }

  .notset {
    color: var(--text-light);
  }

  h3 {
    margin-right: 1rem;
  }

  @media (max-width: 576px) {
    .item {
      display: block;
      margin: 0.5rem;
    }

    span {
      margin-left: 0.5rem;
    }
  }
</style>
