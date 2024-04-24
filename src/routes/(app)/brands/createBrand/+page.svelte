<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Select } from "$lib/components/ui/select";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { createEventDispatcher, onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  const dispatch = createEventDispatcher();

  export let editData;
  export let editForm: boolean;
  let updateImage: boolean = false;
  let validation: any = {};

  let brandDetails = {
    name: "",
    logo: "",
    description: "",
  };
  let id = "";

  if (editForm) {
    brandDetails = {
      name: editData.name,
      logo: editData.logo,
      description: editData.description,
    };
    id = editData.id;
  }

  let imageUpload: HTMLInputElement;

  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    if (imageUpload.files && imageUpload.files.length > 0) {
      updateImage = true;
      brandDetails.logo = imageUpload.files[0];
    }
  }

  async function createBrand() {
    try {
      validation = {};

      if (brandDetails.name == "") {
        validation.name = ["This field may not be blank."];
      }

      if (brandDetails.description == "") {
        validation.description = ["This field may not be blank."];
      }

      const form = new FormData();
      if (updateImage) {
        form.append("logo", brandDetails.logo);
      }
      form.append("name", brandDetails.name);
      form.append("description", brandDetails.description);

      if (validation.name || validation.description) {
        toast(`Please fill the required field`);
      } else {
        const url = editForm
          ? `/masterdata/brand/${id}/update_record/`
          : "/masterdata/brand/create_record/";

        if (editForm) {
          await API.put(url, form);
        } else {
          await API.post(url, form);
        }

        dispatch("newBrand");
        const action = editForm ? "Brand Updated" : "Brand Created";
        toast(`${action} successfully!`);
      }
    } catch (error: any) {
      const action = editForm ? "Update Brand" : "Create Brand";
      console.log(`${action}:`, error);
      validation = error.response.data;
      toast(`Failed to ${action}`);
    }
  }

  function cancelModel() {
    dispatch("cancel");
    updateImage = false;
  }
</script>

<Dialog.Root open={true} onOpenChange={cancelModel}>
  <Dialog.Content>
    <Dialog.Header class="font-bold mb-5">
      <Dialog.Title>{editForm ? "Update Brand" : "New Brand"}</Dialog.Title>
    </Dialog.Header>
    <div class="mb-3">
      <Label for="name">Name</Label>
      <Input
        id="name"
        bind:value={brandDetails.name}
        placeholder="Name"
        class="input {validation.name ? 'border-red-500' : ''}"
        type="text"
      />
      <p class="text-red-500">{validation.name ? validation.name : ""}</p>
    </div>

    <div class="mb-3">
      <Label for="description">Description</Label>
      <Textarea
        id="description"
        bind:value={brandDetails.description}
        placeholder="Description"
        class="textarea {validation.description ? 'border-red-500' : ''}"
      />
      <p class="text-red-500">
        {validation.description ? validation.description : ""}
      </p>
    </div>

    <div class="flex justify-between mb-3">
      <Button type="button" variant="outline" on:click={pickAvatar}>
        <i class="fa-solid fa-image text-sm"></i>Upload Logo
      </Button>

      <img
        id="selected-logo"
        alt="logo"
        class:showImg={brandDetails.logo}
        class:hideImg={!brandDetails.logo}
        src={updateImage
          ? window.URL.createObjectURL(brandDetails.logo)
          : brandDetails.logo}
      />

      <input
        type="file"
        id="file-input"
        bind:this={imageUpload}
        hidden
        accept="image/png, image/jpeg"
        on:change={uploadAvatar}
      />
    </div>
    <Dialog.Footer>
      <Button type="button" variant="ghost" on:click={cancelModel}
        >Cancel</Button
      >
      <Button type="submit" on:click={createBrand}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

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
