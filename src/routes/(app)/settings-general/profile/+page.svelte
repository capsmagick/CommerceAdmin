<script lang="ts">
    import Label from "$lib/components/ui/label/label.svelte";
    import Input from "$lib/components/ui//input/input.svelte";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

</script>
      <div id="profile" class="setting-section">
        <h2 class="text-2xl font-semibold mb-5">Profile Settings</h2>
        <div class="grid grid-cols-3">

            <div class="col-span-2">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label for="fname" class="block text-sm font-medium text-gray-700">First Name</Label>
                        <Input id="fname" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" placeholder="First Name" />
                    </div>
                    <div>
                        <Label for="lname" class="block text-sm font-medium text-gray-700">Last Name</Label>
                        <Input id="lname" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" placeholder="Last Name" />
                    </div>
                </div>

                 <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label for="email" class="block text-sm font-medium text-gray-700">E mail</Label>
                        <Input id="email" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" placeholder="E mail" />
                    </div>
                    <div>
                        <Label for="number" class="block text-sm font-medium text-gray-700">Phone Number</Label>
                        <Input id="number" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" placeholder="Phone Number" />
                    </div>
                    <div class="col-span-2">
                        <Label for="address" class="block text-sm font-medium text-gray-700">Address</Label>
                        <Textarea id="address"  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" placeholder="Address" />
                    </div>
                </div>
            </div>

            <div class="col-span-1">
                <div class="flex flex-col items-center justify-center">
                    <div class="mb-4"><img class=" rounded-full" src="" alt="user_profile_pic"></div>
                    <div><Button>Change Profile</Button></div>
                </div>
            </div>
            <Button>Save Changes</Button>
        </div>
      </div>