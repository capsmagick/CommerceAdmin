<script lang="ts">
import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
import API from "$lib/services/api";
import { goto } from '$app/navigation';


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

<div class="bg-white px-4 py-2 h-16 text-base border-b flex items-center  justify-between">

   <div class="order-last">
   <DropdownMenu.Root >
      <DropdownMenu.Trigger class="flex items-center cursor-pointer">
         <div>
            <i class="fa-solid fa-gear text-gray-600 text-2xl"></i>
         </div>
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
<div class="flex items-center gap-4">
  <input type="text" placeholder="Search..." class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
  <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
    <i class="fa-solid fa-magnifying-glass"></i>
  </button>
</div>
</div>
