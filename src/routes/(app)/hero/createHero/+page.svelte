<script lang="ts">
    import {Input} from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import {Textarea} from "$lib/components/ui/textarea";
    import {Select} from "$lib/components/ui/select";
    import {Button} from "$lib/components/ui/button";
    import API from "$lib/services/api";
    import {createEventDispatcher, onMount} from "svelte";
    import {toast} from "svelte-sonner";
    import * as Card from "$lib/components/ui/card";

    const dispatch = createEventDispatcher();

    export let editData;
    export let editForm: boolean;
    let updateImage: boolean = false

    let heroDetails = {
    name: "",
    image: "",
    description: "",
    quote: "",
    ctaButton: "",
    ctaLink: "",
};
let id = "";

const url = editForm ? `/masterdata/hero/${id}/update_record/` : "/masterdata/hero/create_record/";
    

    if (editForm) {
        heroDetails = {
            name: editData.name,
            image: editData.image,
            description: editData.description,
            quote: editData.quote,
            ctaButton: editData.ctaButton,
            ctaLink: editData.ctaLink,
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
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target) {
        heroDetails.image = e.target.result as string;
    }
        };
        reader.readAsDataURL(imageUpload.files[0]);
    }
}

    async function createHero() {
        try {
            const form = new FormData();
            if(updateImage){
                form.append("image", heroDetails.image);
            }
            form.append("name", heroDetails.name);
            form.append("description", heroDetails.description);
            form.append("quote", heroDetails.quote);
            form.append("ctaButton", heroDetails.description);
            form.append("ctaLink", heroDetails.description);

            // const url = editForm ? `/masterdata/brand/${id}/update_record/` : "/masterdata/brand/create_record/";

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
    dispatch('cancel');
    updateImage = false;
  }
    function handleClickOutside(event: any) {
    if (!event.target.closest('.card')) {
      cancelModel();
    }
  }
  
onMount(() => {
  const timeout = setTimeout(() => {
    document.addEventListener('mousedown', handleClickOutside);
  }, 100);

  return () => {
    clearTimeout(timeout);
    document.removeEventListener('mousedown', handleClickOutside);
  };
});

</script>

<div class="fixed bg-background inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
   <div class="flex items-center justify-center">
       <div class="glow-border">
           <div class="card glow-border-content bg-background text-foreground overflow-y-auto" style="max-height:90vh;">
                <Card.Root class="p-6 rounded-lg">
                    <Card.Header class="font-bold mb-5">
                        <Card.Title>{editForm ? 'Update Hero' : 'New Hero'}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                            <div class="mb-3">
                                <Label for="name">Name</Label>
                                <Input id="name" bind:value={heroDetails.name} placeholder="Name" class="input"/>
                            </div>
                           
                            <div class="mb-3">
                                <Label for="description">Description</Label>
                                <Textarea id="description" bind:value={heroDetails.description} placeholder="Description" class="textarea"/>
                            </div>

                            <div class="mb-3">
                                <Label for="quote">Quote</Label>
                                <Input id="quote" bind:value={heroDetails.description} placeholder="Quote" class="textarea"/>
                            </div>

                            <div class="mb-3">
                                <Label for="ctaButton">CTA Button Name</Label>
                                <Input id="ctaButton" bind:value={heroDetails.description} placeholder="CTA Button Name" class="textarea"/>
                            </div>

                            <div class="mb-3">
                                <Label for="ctaLink">CTA Link</Label>
                                <Input id="ctaLink" bind:value={heroDetails.description} placeholder="CTA Link" class="textarea"/>
                            </div>
                           
                            <div class="flex items-center gap-2">
                                <Button type="button"  variant ="outline"
                                        on:click={pickAvatar}>
                                    <i class="fa-solid fa-image text-sm"></i>Upload image
                                </Button>
                                <label for="file-input">
                                <img src={heroDetails.image} alt="Avatar" class="showImg" />
                                </label>
                                <input type="file" id="file-input" bind:this={imageUpload} hidden accept="image/png, image/jpeg" 
                                       on:change={uploadAvatar}/>
                            </div>
                    </Card.Content>
                    <Card.Footer  class="justify-between space-x-2">
                        <Button type="button" variant="ghost" on:click={() => dispatch("cancel")}>Cancel</Button>
                        <Button type="submit"  on:click={createHero}>Save</Button>
                    </Card.Footer>
                </Card.Root>
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
    .card::-webkit-scrollbar {
    display: none;
    }
</style>
