<script lang="ts">
    import {Input} from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import {Textarea} from "$lib/components/ui/textarea";
    import * as Select from "$lib/components/ui/select";
    import {Button} from "$lib/components/ui/button";
    import API from "$lib/services/api";
    import {createEventDispatcher, onMount} from "svelte";
    import {toast} from "svelte-sonner";
    import * as Card from "$lib/components/ui/card";

    const dispatch = createEventDispatcher();

    export let editData;
    export let editForm;
    let tags: any = [];
    let selectedTagGroups: string; 

    let collectionDetails = {
        name: "",
        feature_image: "",
        description: "",
        collections: "",
        tags: [],
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

    async function fetchTags() {
        try {
        const res = await API.get("/masterdata/tag/");
        tags = res.data.results;
        } catch (error) {
        console.log("category:fetch-tags:", error);
        }
    }

    function handleTagChange(selectedTags: { value: number }) {
        selectedTagGroups = tags.find((g: any) => g.id == selectedTags.value);
        collectionDetails.tags.push(selectedTagGroups.id);
     }

    let imageUpload: HTMLInputElement;

    function pickAvatar() {
        imageUpload.click();
    }

    async function uploadAvatar() {
        if (imageUpload.files && imageUpload.files.length > 0) {
            collectionDetails.feature_image = imageUpload.files[0];
            const img: HTMLImageElement | null = document.getElementById("selected-feature_image") as HTMLImageElement;
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
            form.append("tags", collectionDetails.tags);

            const url = editForm ? `/products/collection/${id}/update_record/` : "/products/collection/create_record/";

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
    dispatch('cancel');
  }
    function handleClickOutside(event) {
    if (!event.target.closest('.card')) {
      cancelModel();
    }
  }

onMount(async () => {
    await fetchTags();
  });
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
           <div class="card glow-border-content bg-background text-foreground overflow-y-auto"  style="max-height:90vh;">
                <Card.Root class="p-6 rounded-lg">
                    <Card.Header class="font-bold mb-5">
                        <Card.Title>{editForm ? 'Update Collection' : 'New Collection'}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                            <div class="mb-3">
                                <Label for="name">Name</Label>
                                <Input id="name" bind:value={collectionDetails.name} placeholder="Name" class="input" type="text"/>
                            </div>
                           
                            <div class="mb-3">
                                <Label for="description">Description</Label>
                                <Textarea id="description" bind:value={collectionDetails.description} placeholder="Description" class="textarea" type="text"/>
                            </div>

                            <!-- <div class="mb-3">
                                <Label for="collections">Collections</Label>
                                <Input id="collections" bind:value={collectionDetails.collections} placeholder="Collections" class="input"/>
                            </div> -->
                           
                            <div class="items-center gap-2 mb-3">
                                <Label for="description">Tag</Label>
                                <Select.Root>
                                    <Select.Trigger class="input capitalize"
                                    >{selectedTagGroups
                                        ? selectedTagGroups.name
                                        : "Select a Tag"}</Select.Trigger
                                    >
                                    <Select.Content>
                                    <Select.Group>
                                        {#each tags as tag}
                                        <Select.Item
                                            value={tag.id}
                                            label={tag.name}
                                            class="capitalize card"
                                            on:click={() => handleTagChange({ value: tag.id })}
                                        >
                                            {tag.name}
                                        </Select.Item>
                                        {/each}
                                    </Select.Group>
                                    </Select.Content>
                                </Select.Root>
                            </div>

                            <div class="flex items-center gap-2">
                                <Button type="button"  variant ="outline"
                                        on:click={pickAvatar}>
                                    <i class="fa-solid fa-image text-sm"></i>Upload Image
                                </Button>
            
                                <img id="selected-feature_image" alt="" class:showImg={collectionDetails.feature_image} class:hideImg={!collectionDetails.feature_image} src=""/>
            
                                <input type="file" id="file-input" bind:this={imageUpload} hidden accept="image/png, image/jpeg"
                                       on:change={uploadAvatar}/>
                            </div>
                    </Card.Content>
                    <Card.Footer  class="justify-between space-x-2">
                        <Button type="button" variant="ghost" on:click={() => dispatch("cancel")}>Cancel</Button>
                        <Button type="submit"  on:click={createCollection}>Save</Button>
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
