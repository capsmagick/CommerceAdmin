<script lang="ts">
    import {Input} from "$lib/components/ui/input";
    import {Textarea} from "$lib/components/ui/textarea";
    import {Select} from "$lib/components/ui/select";
    import {Button} from "$lib/components/ui/button";
    import API from "$lib/services/api";
    import {createEventDispatcher} from "svelte";
    import {toast} from "svelte-sonner";

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
    <div class="bg-white p-6 rounded-lg">
        <header class="font-bold mb-5" style="color: black">
            <h1>{editForm ? 'Update Brand' : 'New Brand'}</h1>
        </header>
        <main>
            <form class="space-y-6">
                <Input bind:value={brandDetails.name} placeholder="Name" class="input"/>
                <Textarea bind:value={brandDetails.description} placeholder="Description" class="textarea"/>
                <div class="flex items-center gap-2">
                    <Button type="button" class="btn flex gap-2 items-center bg-indigo-500 text-white text-xs"
                            on:click={pickAvatar}>
                        <i class="fa-solid fa-image text-sm"></i>Upload Logo
                    </Button>

                    <img id="selected-logo" alt="" class:showImg={brandDetails.logo} class:hideImg={!brandDetails.logo} src=""/>

                    <input type="file" id="file-input" bind:this={imageUpload} hidden accept="image/png, image/jpeg"
                           on:change={uploadAvatar}/>
                </div>
            </form>
        </main>
        <footer class="mt-5 flex">
            <Button type="button" class="btn mr-2" on:click={createBrand}>Submit</Button>
            <Button class="text-xs flex items-center gap-2 border border-red-500 bg-red-500 text-white px-4 py-1.5 rounded"
                    on:click={() => dispatch("close")}>Cancel
            </Button>
        </footer>
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
