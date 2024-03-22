<script lang="ts">
    import {Input} from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import {Textarea} from "$lib/components/ui/textarea";
    import {Select} from "$lib/components/ui/select";
    import {Button} from "$lib/components/ui/button";
    import API from "$lib/services/api";
    import {createEventDispatcher} from "svelte";
    import {toast} from "svelte-sonner";
    import * as Card from "$lib/components/ui/card";

    const dispatch = createEventDispatcher();

    export let editData;
    export let editForm;

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
            brandDetails.logo = imageUpload.files[0];
            const img: HTMLImageElement | null = document.getElementById("selected-logo") as HTMLImageElement;
            if (img) {
                img.src = window.URL.createObjectURL(brandDetails.logo);
            }
        }
    }

    async function createBrand() {
        try {
            const form = new FormData();
            form.append("logo", brandDetails.logo);
            form.append("name", brandDetails.name);
            form.append("description", brandDetails.description);

            const url = editForm ? `/masterdata/brand/${id}/update_record/` : "/masterdata/brand/create_record/";

            if (editForm) {
                await API.put(url, form);
            } else {
                await API.post(url, form);
            }

            dispatch("newBrand");
            const action = editForm ? "Brand Updated" : "Brand Created";
            toast(`${action} successfully!`);
        } catch (error) {
            const action = editForm ? "Update Brand" : "Create Brand";
            console.log(`${action}:`, error);
            toast(`Failed to ${action}`);
        }
    }
</script>

<div class="fixed bg-background inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
   <div class="flex items-center justify-center">
       <div class="glow-border">
           <div class="card glow-border-content bg-background text-foreground">
                <Card.Root class="p-6 rounded-lg">
                    <Card.Header class="font-bold mb-5">
                        <Card.Title>{editForm ? 'Update Brand' : 'New Brand'}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                            <div class="mb-3">
                                <Label for="name">Name</Label>
                                <Input id="name" bind:value={brandDetails.name} placeholder="Name" class="input"/>
                            </div>
                           
                            <div class="mb-3">
                                <Label for="description">Description</Label>
                                <Textarea id="description" bind:value={brandDetails.description} placeholder="Description" class="textarea"/>
                            </div>
                           
                            <div class="flex items-center gap-2">
                                <Button type="button"  variant ="outline"
                                        on:click={pickAvatar}>
                                    <i class="fa-solid fa-image text-sm"></i>Upload Logo
                                </Button>
            
                                <img id="selected-logo" alt="" class:showImg={brandDetails.logo} class:hideImg={!brandDetails.logo} src=""/>
            
                                <input type="file" id="file-input" bind:this={imageUpload} hidden accept="image/png, image/jpeg"
                                       on:change={uploadAvatar}/>
                            </div>
                    </Card.Content>
                    <Card.Footer  class="justify-between space-x-2">
                        <Button type="button" variant="ghost" on:click={() => dispatch("close")}>Cancel</Button>
                        <Button type="submit"  on:click={createBrand}>Save</Button>
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
</style>
