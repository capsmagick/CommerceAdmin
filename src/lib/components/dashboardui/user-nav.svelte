<script lang="ts">
	import * as DropdownMenu from "../ui/dropdown-menu";
	import * as Avatar from "../ui/avatar";
	import { Button } from "../ui/button";
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

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar.Root class="h-8 w-8">
				<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
				<Avatar.Fallback>SC</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">shadcn</p>
				<p class="text-xs leading-none text-muted-foreground">m@example.com</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item>
				Profile
				<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				Billing
				<DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				Settings
				<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item>New Team</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={logout}>
			Log out
			<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>