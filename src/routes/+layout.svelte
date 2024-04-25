<script lang="ts">
    import {onMount} from "svelte";
    import {isAuthenticated,checkAuthentication} from "$lib/services/guard";
    import {ModeWatcher} from "mode-watcher";
    import {goto} from "$app/navigation";
    import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
    import {Toaster} from "$lib/components/ui/sonner";

    let unsubscribe: () => void; 
    onMount(() => {

       localStorage.setItem("lastVisitedRoute", window.location.pathname);
     
        (async () => {
            const authStatus = await checkAuthentication(); // Assuming isAuthenticated is a Promise
            console.log("authStatus :",authStatus)
            if (authStatus) {
            
                const lastVisitedRoute = localStorage.getItem("lastVisitedRoute");
                console.log("last visited rout :",lastVisitedRoute)
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