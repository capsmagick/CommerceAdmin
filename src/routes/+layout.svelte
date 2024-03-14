<script lang="ts">
  import { onMount } from "svelte";
  import { isAuthenticated } from "$lib/services/guard";
  import { ModeWatcher } from "mode-watcher";
  import { goto } from "$app/navigation";
  import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
  import { Toaster } from "$lib/components/ui/sonner";

  onMount(() => {
    localStorage.setItem("lastVisitedRoute", window.location.pathname);
    let unsubscribe: () => void; // Declare unsubscribe outside to ensure it's accessible for cleanup

    // Immediately invoked function expression (IIFE) to handle async logic
    (async () => {
      const isAuthenticatedValue = await isAuthenticated;
      if (isAuthenticatedValue) {
        const lastVisitedRoute = localStorage.getItem("lastVisitedRoute");
        if (lastVisitedRoute) {
          goto(lastVisitedRoute);
        } else {
          goto("/dashboard");
        }
      } else {
        goto("/login");
      }
    })();

    return () => {
      if (unsubscribe) unsubscribe(); // Ensure unsubscribe is called if it's defined
    };
  });
</script>

<LoadingIndicator />
<ModeWatcher />
<Toaster />
<slot />
