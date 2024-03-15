<script lang="ts">
  import { onMount } from 'svelte';
  import { navigating } from '$app/stores';
  import { writable } from 'svelte/store';

  // A store to track if the initial loading is done
  const initialLoadDone = writable(false);

  onMount(() => {
    // Assume the initial load is done once the component mounts
    initialLoadDone.set(true);
  });

  // A derived store to determine if the loading indicator should be shown
  $: showLoading = !$initialLoadDone || $navigating;
</script>
<div>
{#if showLoading}
<div class="flex items-center bg-gray-900 dark:bg-gray-100 dark:bg-opacity-20 bg-opacity-20 justify-center h-screen fixed inset-0 z-50">
  <div class="relative">
      <div class="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
      <div class="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-violet-500 animate-spin">
      </div>
  </div>
</div>
{/if}
</div>