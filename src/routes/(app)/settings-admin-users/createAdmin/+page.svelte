<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { toast } from "svelte-sonner";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Label } from "$lib/components/ui/label";

  const dispatch = createEventDispatcher();

  export let editData;
  export let editForm: boolean;
  let updateImage: boolean = false;
  let adminDetails: any = {};
  let imageUpload: any;

  if (editForm) {
    adminDetails = editData;
  }

  async function createAdmin() {
    try {
      const formData = new FormData();

      formData.append("username", adminDetails.username);
      formData.append("first_name", adminDetails.first_name);
      formData.append("last_name", adminDetails.last_name);
      formData.append("email", adminDetails.email);
      formData.append("mobile_number", adminDetails.mobile_number);
      formData.append("date_of_birth", adminDetails.date_of_birth);
      if (updateImage) {
        formData.append("profile_picture", adminDetails.profile_picture);
      }
      const url = editForm
        ? `/account/manager/${adminDetails.id}/update_record/`
        : "/account/manager/create_record/";

      if (editForm) {
        // await API.put(url, formData);
      } else {
        await API.post(url, formData);
      }

      dispatch("newAdmin");
      const action = editForm ? "Admin Updated" : "Admin Created";
      toast(`${action} successfully!`);
    } catch (error) {
      const action = editForm ? "Update Admin" : "Create Admin";
      console.log(`${action}:`, error);
      toast(`Failed to ${action}`);
    }
  }

  //   Logo upload
  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    updateImage = true;
    adminDetails.profile_picture = imageUpload.files[0];
  }

  function cancelModel() {
    adminDetails = null;
    dispatch("cancel");
  }
</script>

<Dialog.Root open={true} onOpenChange={cancelModel} preventScroll={true}>
  <Dialog.Content>
    <Dialog.Header class="font-bold mb-5">
      <Dialog.Title>{editForm ? "Update Admin" : "New Admin"}</Dialog.Title>
    </Dialog.Header>

    <div class="grid grid-cols-2 gap-4 mb-3">
      <div class="grid gap-2">
        <Label>First Name</Label>
        <Input
          bind:value={adminDetails.first_name}
          placeholder="First Name"
          class="input"
          type="text"
        />
      </div>
      <div class="grid gap-2">
        <Label>Last Name</Label>
        <Input
          bind:value={adminDetails.last_name}
          placeholder="Last Name"
          class="input"
          type="text"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-3">
      <div class="grid gap-2">
        <Label>Username</Label>
        <Input
          bind:value={adminDetails.username}
          placeholder="Username"
          class="input"
          type="text"
          autocomplete="off"
        />
      </div>

      <div class="grid gap-2">
        <Label>E Mail</Label>
        <Input
          bind:value={adminDetails.email}
          placeholder="E Mail"
          class="input"
          type="text"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-3">
      <div class="grid gap-2">
        <Label>Phone Number</Label>
        <Input
          bind:value={adminDetails.mobile_number}
          placeholder="Phone Number"
          class="input"
          type="text"
        />
      </div>

      <div class="grid gap-2">
        <Label>Date of Birth</Label>
        <Input
          bind:value={adminDetails.date_of_birth}
          class="input"
          type="date"
        />
      </div>
    </div>

    <div class="flex justify-between mb-3">
      <Button
        type="button"
        class="btn flex gap-2 items-center bg-indigo-500 text-white text-xs"
        on:click={pickAvatar}
        ><i class="fa-solid fa-image text-sm"></i>Upload admin image
      </Button>
      <img
        id="selected-logo"
        alt=""
        class={adminDetails.profile_picture ? "showImg" : "hideImg"}
        src={updateImage
          ? window.URL.createObjectURL(adminDetails.profile_picture)
          : adminDetails.profile_picture}
      />
      <input
        type="file"
        id="file-input"
        bind:this={imageUpload}
        hidden
        accept="image/png, image/jpeg"
        on:input={uploadAvatar}
      />
    </div>

    <!-- Assuming Select component exists and can handle multiple selections -->

    <Dialog.Footer>
      <Button type="button" variant="ghost" on:click={cancelModel}
        >Cancel
      </Button>

      <Button type="button" on:click={createAdmin}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<style>
  .hideImg {
    visibility: hidden;
  }

  .showImg {
    display: block;
    height: 6rem;
    width: 6rem;
    flex: none;
    border-radius: 20px;
    object-fit: cover;
  }
</style>
