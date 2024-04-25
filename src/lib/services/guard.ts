import {writable} from 'svelte/store';
import { UserStore } from "$lib/stores/data";
import {goto} from "$app/navigation";
import API from "$lib/services/api";

export const isAuthenticated = writable(false);


import { browser } from '$app/environment'; 

// isAuthenticated.subscribe(async () => {
//     await checkAuthentication();
// });

export async function checkAuthentication() {
    try {
       
        console.log("isAuthenticated before:",isAuthenticated)
        const response = await API.get('/account/user/me/');
        if (response.data.loggedIn === true) {
            const user = response.data.user
            UserStore.set(user);
            //isAuthenticated.set(true);
            return true;
            
       
        } else {
           // isAuthenticated.set(false);
            console.log("isAuthenticated false:",isAuthenticated)
            if (browser) { // Check if running in the browser
                await goto('/login');
            }
            return false
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
       // isAuthenticated.set(false);
        return false
    }
    return false
}

//checkAuthentication();
