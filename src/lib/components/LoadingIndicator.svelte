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

{#if showLoading}
<div class="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
  <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
</div>
{/if}

<style>
  .loader {
    border-top-color: #3498db; /* Blue spinner color */
    -webkit-animation: spinner 1.5s linear infinite;
    animation: spinner 1.5s linear infinite;
  }

  @-webkit-keyframes spinner {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  @keyframes spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>