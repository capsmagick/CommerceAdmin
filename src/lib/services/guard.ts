import {writable} from 'svelte/store';
import { UserStore } from "$lib/stores/data";
import {goto} from "$app/navigation";
import API from "$lib/services/api";

export const isAuthenticated = writable(false);

async function checkAuthentication() {
    try {
        const response = await API.get('/account/user/me/');
        console.log('response:', response)
        if (response.data.loggedIn === true) {
            const user = response.data.user
            UserStore.set(user);
            isAuthenticated.set(true);
        } else {
            isAuthenticated.set(false);
            await goto('/login');
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        isAuthenticated.set(false);
    }
}

checkAuthentication();
