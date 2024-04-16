<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
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

  let heroDetails = {
    id: "",
    name: "",
    cta_text: "",
    image: "",
    short_description: "",
    link: "",
  };

  if (editForm) {
    heroDetails = editData;
  }

  let imageUpload: HTMLInputElement;

  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    if (imageUpload.files && imageUpload.files.length > 0) {
      updateImage = true;
      heroDetails.image = imageUpload.files[0];
    }
  }

  async function createHero() {
    try {
      const form = new FormData();
      if (updateImage) {
        form.append("image", heroDetails.image);
      }
      form.append("short_description", heroDetails.short_description);
      form.append("name", heroDetails.name);
      form.append("cta_text", heroDetails.cta_text);
      form.append("link", heroDetails.link);
      // form.append("name", heroDetails.name);

      const url = editForm
        ? `/cms/hero-section/${heroDetails.id}/update_record/`
        : "/cms/hero-section/create_record/";

      if (editForm) {
        await API.put(url, form);
      } else {
        await API.post(url, form);
      }

      dispatch("newHero");
      const action = editForm ? "Hero Updated" : "Hero Created";
      toast(`${action} successfully!`);
    } catch (error) {
      const action = editForm ? "Update Hero" : "Create Hero";
      console.log(`${action}:`, error);
      toast(`Failed to ${action}`);
    }
  }

  function cancelModel() {
    dispatch("cancel");
    updateImage = false;
  }
//   function handleClickOutside(event: any) {
//     if (!event.target.closest(".card")) {
//       cancelModel();
//     }
//   }

//   onMount(() => {
//     const timeout = setTimeout(() => {
//       document.addEventListener("mousedown", handleClickOutside);
//     }, 100);

//     return () => {
//       clearTimeout(timeout);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   });
</script>

<!-- <div class="fixed bg-background inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
   <div class="flex items-center justify-center">
       <div class="glow-border">
           <div class="card glow-border-content bg-background text-foreground overflow-y-auto" style="max-height:90vh;"> -->
<Dialog.Root open={true} onOpenChange={cancelModel}>
  <Dialog.Content>
    <Dialog.Header class="font-bold mb-5">
      <Dialog.Description
        >{editForm ? "Update Hero" : "New Hero"}</Dialog.Description
      >
    </Dialog.Header>
    <div class="mb-3">
      <Label for="name">Name</Label>
      <Input
        id="name"
        bind:value={heroDetails.name}
        placeholder="Name"
        class="textarea"
      />
    </div>

    <div class="mb-3">
      <Label for="short_description">Description</Label>
      <Textarea
        id="short_description"
        bind:value={heroDetails.short_description}
        placeholder="Description"
        class="textarea"
      />
    </div>

    <div class="mb-3">
      <Label for="cta_text">CTA Button Name</Label>
      <Input
        id="cta_text"
        bind:value={heroDetails.cta_text}
        placeholder="CTA Button Name"
        class="textarea"
      />
    </div>

    <div class="mb-3">
      <Label for="link">CTA Link</Label>
      <Input
        id="link"
        bind:value={heroDetails.link}
        placeholder="CTA Link"
        class="textarea"
      />
    </div>

    <div class="flex justify-between mb-3">
      <Button type="button" variant="outline" on:click={pickAvatar}>
        <i class="fa-solid fa-image text-sm"></i>Upload image
      </Button>
      <label for="file-input">
        {#if heroDetails.image}
          <img
            src={updateImage
              ? window.URL.createObjectURL(heroDetails.image)
              : heroDetails.image}
            alt="Avatar"
            class="showImg"
          />
        {/if}
      </label>
      <input
        type="file"
        id="file-input"
        bind:this={imageUpload}
        hidden
        required={!imageUpload}
        accept="image/png, image/jpeg"
        on:change={uploadAvatar}
      />
    </div>
    <Dialog.Footer class="justify-between space-x-2">
      <Button type="button" variant="ghost" on:click={cancelModel}
        >Cancel</Button
      >
      <Button type="submit" on:click={createHero}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- </div>
       </div>
   </div>
</div> -->

<style>
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
