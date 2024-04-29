<script lang="ts">
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui//input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { onMount } from "svelte";
  import { UserStore } from "$lib/stores/data";

  const baseUrl: string = import.meta.env.VITE_BASE_URL as string;

  let user: any = {};
  let updateImage: boolean = false;

  let imageUpload: HTMLInputElement;

  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    if (imageUpload.files && imageUpload.files.length > 0) {
      updateImage = true;
      user.profile_picture = imageUpload.files[0];
    }
  }

  function getUser() {
    UserStore.subscribe((userData) => {
      if (userData) {
        user = userData;
      } else {
        return null;
      }
    });
  }
  onMount(getUser);
</script>

<div id="profile" class="setting-section">
  <h2 class="text-2xl font-semibold my-5">Profile Settings</h2>
  <div class="grid grid-cols-3">
    <div class="grid">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label for="fname" class="block text-sm font-medium text-gray-700"
            >First Name</Label
          >
          <Input
            id="fname"
            type="text"
            bind:value={user.first_name}
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="First Name"
          />
        </div>
        <div>
          <Label for="lname" class="block text-sm font-medium text-gray-700"
            >Last Name</Label
          >
          <Input
            id="lname"
            type="text"
            bind:value={user.last_name}
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Last Name"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label for="email" class="block text-sm font-medium text-gray-700"
            >E mail</Label
          >
          <Input
            id="email"
            type="text"
            bind:value={user.email}
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="E mail"
          />
        </div>
        <div>
          <Label for="number" class="block text-sm font-medium text-gray-700"
            >Phone Number</Label
          >
          <Input
            id="number"
            type="text"
            bind:value={user.mobile_number}
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Phone Number"
          />
        </div>
        <div class="grid grid-col-2 col-span-1">
          <Label for="address" class="block text-sm font-medium text-gray-700"
            >Username</Label
          >
          <Input
            id="address"
            bind:value={user.username}
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Username"
          />
        </div>
      </div>
          <div class="flex justify-end"><Button>Save Changes</Button></div>

    </div>

    <div class="col-span-1">
      <div class="flex flex-col items-center justify-center">
        <div class="mb-4">
          <img
            class=" rounded-full"
            class:showImg={user.profile_picture}
            class:hideImg={!user.profile_picture}
            src={updateImage
              ? window.URL.createObjectURL(user.profile_picture)
              : `${baseUrl}${user.profile_picture}`}
            alt="user_profile_pic"
          />
        </div>
        <div><Button on:click={pickAvatar}>Change Profile</Button></div>
        <input
          type="file"
          id="file-input"
          bind:this={imageUpload}
          hidden
          accept="image/png, image/jpeg"
          on:change={uploadAvatar}
        />
      </div>
    </div>

  </div>

</div>

<style>
  .hideImg {
    display: none;
  }

  .showImg {
    display: block;
    height: 6rem;
    width: 6rem;
    border-radius: 20px;
    object-fit: cover;
  }
</style>
