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

<div class="bg-background text-foreground px-4 py-2 h-16 text-base border-b flex items-center  ">

 
    
<div class="flex items-center flex-1  gap-4">
  <Input type="text" placeholder="Search..." class="px-4 w-72 py-2 border rounded-md bg-background text-foreground" />
  <Button class="px-4 py-2  text-white rounded-md bg-primary">
    <i class="fa-solid fa-magnifying-glass"></i>
  </Button>
</div>
<div class="flex items-center mr-4 gap-4">
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
  <div class="mr-4 ">
    <DropdownMenu.Root >
       <DropdownMenu.Trigger class="flex items-center cursor-pointer">
         <Avatar.Root>
           <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
           <Avatar.Fallback>CN</Avatar.Fallback>
         </Avatar.Root>
       </DropdownMenu.Trigger>
       <DropdownMenu.Content>
         <DropdownMenu.Group>
           <DropdownMenu.Label>My Account</DropdownMenu.Label>
           <DropdownMenu.Separator />
           <DropdownMenu.Item>Profile</DropdownMenu.Item>
           <DropdownMenu.Item on:click={logout}>Logout</DropdownMenu.Item>
          
         </DropdownMenu.Group>
       </DropdownMenu.Content>
     </DropdownMenu.Root>
     </div>
</div>
