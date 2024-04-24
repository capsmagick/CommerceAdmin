<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { createEventDispatcher, onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";

  const dispatch = createEventDispatcher();

  const baseUrl: string = import.meta.env.VITE_BASE_URL as string;

  export let editData: any;
  export let editForm: boolean;
  let updateImage: boolean = false;
  let lookbookDetails: any = {
    name: "",
    description: "",
    tags: "",
    is_in_home_page: false,
  };
  let tagInput: string = ""; // Holds the raw tag input from the user
  let validation: any = {};

  if (editForm) {
    lookbookDetails = editData;
    tagInput = editData.tags.map((tag) => tag).join(", ");
  }

  // Reactive statement to process tag input and update productDetails.tags
  $: lookbookDetails.tags = tagInput
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");

  let imageUpload: HTMLInputElement;

  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    updateImage = true;
    if (imageUpload.files && imageUpload.files.length > 0) {
      lookbookDetails.feature_image = imageUpload.files[0];
      const img: HTMLImageElement | null = document.getElementById(
        "selected-feature_image"
      ) as HTMLImageElement;
      if (img) {
        img.src = window.URL.createObjectURL(lookbookDetails.feature_image);
      }
    }
  }

  async function createCollection() {
    try {
      validation = {};

      if (lookbookDetails.name == "") {
        validation.name = ["This field may not be blank."];
      }

      if (lookbookDetails.description == "") {
        validation.description = ["This field may not be blank."];
      }

      if (lookbookDetails.tags == "") {
        validation.tags = ["This field may not be blank."];
      }

      const form = new FormData();
      if (updateImage) {
        form.append("feature_image", lookbookDetails.feature_image);
      }
      form.append("name", lookbookDetails.name);
      form.append("description", lookbookDetails.description);
      form.append("tags", lookbookDetails.tags);
      form.append("is_in_home_page", lookbookDetails.is_in_home_page);

      const url = editForm
        ? `/products/look-book/${lookbookDetails.id}/update_record/`
        : "/products/look-book/create_record/";

      if (validation.name || validation.description || validation.tags) {
        toast(`Please fill the required field`);
      } else {
        if (editForm) {
          await API.put(url, form);
        } else {
          await API.post(url, form);
        }

        dispatch("newLookbook");
        const action = editForm ? "Lookbook Updated" : "Lookbook Created";
        toast(`${action} successfully!`);
      }
    } catch (error: any) {
      const action = editForm ? "Update Lookbook" : "Create Lookbook";
      console.log(`${action}:`, error);
      validation = error.response.data;
      toast(`Failed to ${action}`);
    }
  }

  function cancelModel() {
    dispatch("cancel");
  }
</script>

<Dialog.Root open={true} onOpenChange={cancelModel} preventScroll={true}>
  <Dialog.Content>
    <Dialog.Header class="font-bold mb-5">
      <Dialog.Description
        >{editForm ? "Update Lookbook" : "New Lookbook"}</Dialog.Description
      >
    </Dialog.Header>
    <div class="mb-3">
      <Label for="name">Name</Label>
      <Input
        id="name"
        bind:value={lookbookDetails.name}
        placeholder="Name"
        class="input {validation.name ? 'border-red-500' : ''}"
        type="text"
      />
      <p class="text-red-500">{validation.name ? validation.name : ""}</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="grid gap-2">
        <Label for="description">Description</Label>
        <Textarea
          id="description"
          bind:value={lookbookDetails.description}
          placeholder="Description"
          class="textarea {validation.description ? 'border-red-500' : ''}"
        />
        <p class="text-red-500">
          {validation.description ? validation.description : ""}
        </p>
      </div>

      <div class="grid gap-4">
        <Label for="tags">Tags</Label>
        <div>
          <Textarea
            id="tags"
            placeholder="Enter tags separated by comma"
            bind:value={tagInput}
            class={validation.tags ? "border-red-500" : ""}
          />
          <p class="text-red-500">{validation.tags ? validation.tags : ""}</p>
          <p class=" text-blue-400 font-medium">use comma to seperate tags</p>
        </div>
      </div>
    </div>

    <div class="mb-3 flex align-items-center">
      <div>
        <Label for="is_in_home_page" class="me-3">Is In Homepage:</Label>
      </div>
      <div>
        <Switch
          id="is_in_home_page"
          bind:checked={lookbookDetails.is_in_home_page}
        />
      </div>
    </div>
    <div class="flex justify-between mb-3">
      <Button type="button" variant="outline" on:click={pickAvatar}>
        <i class="fa-solid fa-image text-sm"></i>Upload Image
      </Button>

      <img
        id="selected-feature_image"
        alt=""
        class:showImg={lookbookDetails.feature_image}
        class:hideImg={!lookbookDetails.feature_image}
        src={updateImage
          ? window.URL.createObjectURL(lookbookDetails.feature_image)
          : `${baseUrl}${lookbookDetails.feature_image}`}
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
    <Dialog.Footer class="justify-between space-x-2">
      <Button type="button" variant="ghost" on:click={() => dispatch("cancel")}
        >Cancel</Button
      >
      <Button type="submit" on:click={createCollection}>Save</Button>
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
