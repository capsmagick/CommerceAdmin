<script lang="ts">
    import {onMount} from "svelte";
    import {isAuthenticated} from "$lib/services/guard";
    import {ModeWatcher} from "mode-watcher";
    import {goto} from "$app/navigation";
    import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
    import {Toaster} from "$lib/components/ui/sonner";

    onMount(() => {

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
        localStorage.setItem("lastVisitedRoute", window.location.pathname);
        let unsubscribe: () => void; // Declare unsubscribe outside to ensure it's accessible for cleanup

        // Immediately invoked function expression (IIFE) to handle async logic
        // (async () => {
        //   const isAuthenticatedValue = await isAuthenticated;
        //   if (isAuthenticatedValue) {
        //     const lastVisitedRoute = localStorage.getItem("lastVisitedRoute");
        //     if (lastVisitedRoute) {
        //       goto(lastVisitedRoute);
        //     } else {
        //       goto("/dashboard");
        //     }
        //   } else {
        //     goto("/login");
        //   }
        // })();
        (async () => {
            const authStatus = await isAuthenticated; // Assuming isAuthenticated is a Promise
            if (authStatus) {
                const lastVisitedRoute = localStorage.getItem("lastVisitedRoute");
                if (lastVisitedRoute) {
                    goto(lastVisitedRoute);
                } else {
                    goto("/dashboard");
                }
                // goto('/dashboard'); // Navigate to the app route if authenticated
            } else {
                goto('/login'); // Navigate to the auth route if not authenticated
            }
        })();


        return () => {
            if (unsubscribe) unsubscribe(); // Ensure unsubscribe is called if it's defined
        };
    });
</script>
<div>

    <ModeWatcher/>
    <Toaster/>


    <LoadingIndicator/>


    <slot/>
</div>