<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { UserStore } from '$lib/stores/data'; // Adjust the import path according to your project structure
  
    onMount(() => {
        let unsubscribe: () => void; // Declare unsubscribe outside to ensure it's accessible for cleanup

  // Immediately invoked function expression (IIFE) to handle async logic
  (async () => {
    unsubscribe = UserStore.subscribe(user => {
      if (Object.keys(user).length !== 0) {
        goto('/dashboard');
      } else {
        goto('/login');
      }
    });
  })();

  return () => {
    if (unsubscribe) unsubscribe(); // Ensure unsubscribe is called if it's defined
  };
});
  </script>
            <slot />