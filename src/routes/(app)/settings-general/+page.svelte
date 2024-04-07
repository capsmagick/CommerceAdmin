<script lang="ts">
import Profile from "./profile/+page.svelte";
import Admin from "./admin/+page.svelte";

let profile = true;
let admin = false;

let items = [{  title: "Profile", status: true }, { title: "Admin", status: false }];

function viewProfile() {
	profile = true;
	admin = false;
}

function viewAdmin() {
  profile = false;
  admin = true;
}

</script>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
        <div class="flex h-screen mt-3">
    <div class="flex-shrink-0 w-64 bg-gray-800 text-white rounded-lg">
      <div class="flex flex-col h-full p-5 space-y-5">
        <h2 class="text-xl font-semibold">Settings</h2>
        <ul class="space-y-2 ">
          <li><button on:click={viewProfile} type="button" class="block py-2 px-3 rounded transition duration-300 hover:bg-gray-700 w-full text-left {profile? "bg-gray-700": '' }">Profile Settings</button></li>
          <li><button on:click={viewAdmin} type="button" class="block py-2 px-3 rounded transition duration-300 hover:bg-gray-700 w-full text-left {admin? "bg-gray-700": '' }">Admin Settings</button></li>
        </ul>
      </div>
    </div>

 
    <div class="flex-1 px-10">
      {#if profile}
      <Profile />
      {/if}
      {#if admin}
      <Admin />
      {/if}
    </div>
  </div>
</div>