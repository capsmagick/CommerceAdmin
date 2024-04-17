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

  const dispatch = createEventDispatcher();

  export let editData: any;
  export let editForm: boolean;
  let tags: any = [];
  let selectedTagGroups: string;

  let collectionDetails = {
    name: "",
    feature_image: "",
    description: "",
    collections: "",
    tags:  [""],
  };
  let id = "";

  if (editForm) {
    collectionDetails = {
      name: editData.name,
      feature_image: editData.feature_image,
      description: editData.description,
      collections: editData.collections,
      tags: editData.tags,
    };
    id = editData.id;
  }
  let tagInput: string = ''; // Holds the raw tag input from the user

  // Reactive statement to process tag input and update productDetails.tags
  $: collectionDetails.tags  = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

  // async function fetchTags() {
  //   try {
  //     const res = await API.get("/masterdata/tag/");
  //     tags = res.data.results;
  //   } catch (error) {
  //     console.log("category:fetch-tags:", error);
  //   }
  // }

  // function handleTagChange(selectedTags: { value: number }) {
  //   selectedTagGroups = tags.find((g: any) => g.id == selectedTags.value);
  //   collectionDetails.tags.push(selectedTagGroups.id);
  // }

  let imageUpload: HTMLInputElement;

  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    if (imageUpload.files && imageUpload.files.length > 0) {
      collectionDetails.feature_image = imageUpload.files[0];
      const img: HTMLImageElement | null = document.getElementById(
        "selected-feature_image"
      ) as HTMLImageElement;
      if (img) {
        img.src = window.URL.createObjectURL(collectionDetails.feature_image);
      }
    }
  }

  async function createCollection() {
    try {
      const form = new FormData();
      form.append("feature_image", collectionDetails.feature_image);
      form.append("name", collectionDetails.name);
      form.append("description", collectionDetails.description);
      form.append("collections", collectionDetails.collections);
      collectionDetails.tags.forEach(tag => {
  form.append("tags[]", tag);
});

      const url = editForm
        ? `/products/collection/${id}/update_record/`
        : "/products/collection/create_record/";

      if (editForm) {
        await API.put(url, form);
      } else {
        await API.post(url, form);
      }

      dispatch("newCollection");
      const action = editForm ? "Collection Updated" : "Collection Created";
      toast(`${action} successfully!`);
    } catch (error) {
      const action = editForm ? "Update Collection" : "Create Collection";
      console.log(`${action}:`, error);
      toast(`Failed to ${action}`);
    }
  }

  function cancelModel() {
    dispatch("cancel");
  }
</script>

<Dialog.Root open={true} onOpenChange={cancelModel}>
  <Dialog.Content>
    <Dialog.Header class="font-bold mb-5">
      <Dialog.Description
        >{editForm ? "Update Collection" : "New Collection"}</Dialog.Description
      >
    </Dialog.Header>
    <div class="mb-3">
      <Label for="name">Name</Label>
      <Input
        id="name"
        bind:value={collectionDetails.name}
        placeholder="Name"
        class="input"
        type="text"
      />
    </div>

    <div class="mb-3">
      <Label for="description">Description</Label>
      <Textarea
        id="description"
        bind:value={collectionDetails.description}
        placeholder="Description"
        class="textarea"
        
      />
    </div>

    <!-- <div class="mb-3">
<Label for="collections">Collections</Label>
<Input id="collections" bind:value={collectionDetails.collections} placeholder="Collections" class="input"/>
                            </div> -->

    <div class="items-center gap-2 mb-3">
      <Label for="tags">Tags</Label>
      <Input
        id="tags"
        placeholder="Enter tags separated by commas"
        bind:value={tagInput} />
        <p class=' text-blue-400 font-medium'>use commas to seperate tags</p>
    </div>

    <div class="flex justify-between mb-3">
      <Button type="button" variant="outline" on:click={pickAvatar}>
        <i class="fa-solid fa-image text-sm"></i>Upload Image
      </Button>

      <img
        id="selected-feature_image"
        alt=""
        class:showImg={collectionDetails.feature_image}
        class:hideImg={!collectionDetails.feature_image}
        src=""
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
  .card::-webkit-scrollbar {
    display: none;
  }
</style>
