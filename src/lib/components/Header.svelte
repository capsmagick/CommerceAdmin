<script lang="ts">
import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
import API from "$lib/services/api";
import { goto } from '$app/navigation';
import Sun from "svelte-radix/Sun.svelte";
  import Moon from "svelte-radix/Moon.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { toggleMode } from "mode-watcher";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import {
		DashboardMainNav,
		Search,
		UserNav
		
	} from "$lib/components/dashboardui/index";


async function logout() {
  // Implement the logout logic here
  try {
    const response = await API.post('/account/user/logout/', {
      method: 'POST',
      data:{}
      // headers: {
      //   'Content-Type': 'application/json',
      //   // Include other headers as needed, for example, authorization headers
      // },
      // // If your API expects a body, include it here. For logout, you might not need it.
      // // body: JSON.stringify({ your: 'data' })
    });
    console.log('Response status:', response.status);

    if (response.status === 200) {
      goto('/login');
      console.log('Logged out successfully');
    }else {
      throw new Error('Logout failed');   
    }
    
    

    
    // Handle successful logout, e.g., redirecting the user or updating UI state
  } catch (error) {
    console.error('Logout error:', error);
    // Handle errors, e.g., showing an error message to the user
  }

}

</script>
<div class="border-b">
  <div class="flex h-16 items-center px-4">
    
    <!-- <div class="flex items-center justify-center w-full absolute left-1/2 transform -translate-x-1/2">
      <strong>SIGNUP CASUALS</strong>
    </div> -->
     <div class="mr-auto flex items-center space-x-4">
      <DashboardMainNav/>
     </div> 
    
      <div class="ml-auto flex items-center space-x-4">
        
          <Search />
          <UserNav />
          <Button on:click={toggleMode} variant="outline" size="icon">
            <Sun
              class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
              class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
          </Button>
      </div>
  </div>
</div>

