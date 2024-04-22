<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
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

  let categoryDetails: any = {  };

  let imageUpload: any;
  let attributeChange: boolean = false;


  if (editForm) {
    console.log(editData);
    
    categoryDetails = editData;
  }

  async function createCategory() {
    try {
      const formData = new FormData();
      console.log("categoryDetails", categoryDetails);

      formData.append("username", categoryDetails.username);
      formData.append("password", categoryDetails.password);
      formData.append("first_name", categoryDetails.first_name);
      formData.append("last_name", categoryDetails.last_name);
      formData.append("email", categoryDetails.email);
      formData.append("mobile_number", categoryDetails.mobile_number);
      formData.append("date_of_birth", categoryDetails.date_of_birth);
      if(updateImage){
      formData.append("profile_picture", categoryDetails.profile_picture);
      }
      const url = editForm
        ? `/account/manager/${categoryDetails.id}/update_record/`
        : "/account/manager/create_record/";

      if (editForm) {
        await API.put(url, formData);
      } else {
        await API.post(url, formData);
      }

      dispatch("newCategory");
      const action = editForm ? "Category Updated" : "Category Created";
      toast(`${action} successfully!`);
    } catch (error) {
      const action = editForm ? "Update Category" : "Create Category";
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
    categoryDetails.profile_picture = imageUpload.files[0];
  }

  function cancelModel() {
    attributeChange = false;
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
          bind:value={categoryDetails.first_name}
          placeholder="First Name"
          class="input"
          type="text"
        />
      </div>
      <div class="grid gap-2">
        <Label>Last Name</Label>
        <Input
          bind:value={categoryDetails.last_name}
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
          bind:value={categoryDetails.username}
          placeholder="Username"
          class="input"
          type="text"
        />
      </div>
      <div class="grid gap-2">
        <Label>Password</Label>
        <Input
          bind:value={categoryDetails.password}
          placeholder="Password"
          class="input"
          type="password"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-3">
      <div class="grid gap-2">
        <Label>E Mail</Label>
        <Input
          bind:value={categoryDetails.email}
          placeholder="E Mail"
          class="input"
          type="text"
        />
      </div>
      <div class="grid gap-2">
        <Label>Phone Number</Label>
        <Input
          bind:value={categoryDetails.mobile_number}
          placeholder="Phone Number"
          class="input"
          type="text"
        />
      </div>
    </div>

    <div>
      <div class="grid gap-2">
        <Label>Date of Birth</Label>
        <Input
          bind:value={categoryDetails.date_of_birth}
          placeholder="Date of birth"
          class="input"
          type="calendar"
        />
      </div>
    </div>

    <div class="flex justify-between mb-3">
      <Button
        type="button"
        class="btn flex gap-2 items-center bg-indigo-500 text-white text-xs"
        on:click={pickAvatar}
        ><i class="fa-solid fa-image text-sm"></i>Upload category image
      </Button>
      <img
        id="selected-logo"
        alt=""
        class={categoryDetails.profile_picture ? "showImg" : "hideImg"}
        src={updateImage
          ? window.URL.createObjectURL(categoryDetails.profile_picture)
          : categoryDetails.profile_picture}
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

      <Button type="button" on:click={createCategory}>Save</Button>
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
