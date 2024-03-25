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
    export let editForm;

    let lookbookDetails = {
        name: "",
        variants: "",
    };
    let id = "";

    if (editForm) {
        lookbookDetails = {
            name: editData.name,
            variants: editData.variants,
        };
        id = editData.id;
    }

    async function createLookbook() {
        try {
            const form = new FormData();

            form.append("name", lookbookDetails.name);
            // form.append("variants", JSON.stringify(lookbookDetails.variants));
            form.append("variants", lookbookDetails.variants);

            const url = editForm ? `/products/look-book/${id}/update_record/` : "/products/look-book/create_record/";

            if (editForm) {
                await API.put(url, form);
            } else {
                await API.post(url, form);
            }

            dispatch("newLookbook");
            const action = editForm ? "Lookbook Updated" : "Lookbook Created";
            toast(`${action} successfully!`);
        } catch (error) {
            const action = editForm ? "Update Lookbook" : "Create Lookbook";
            console.log(`${action}:`, error);
            toast(`Failed to ${action}`);
        }
    }

      function cancelDelete() {
    dispatch('cancel');
  }
    function handleClickOutside(event) {
    if (!event.target.closest('.card')) {
      cancelDelete();
    }
  }
  
onMount(() => {
  const timeout = setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  }, 100);

  return () => {
    clearTimeout(timeout);
    document.removeEventListener('click', handleClickOutside);
  };
});
</script>

<div class="fixed bg-background inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
   <div class="flex items-center justify-center">
       <div class="glow-border">
           <div class="card glow-border-content bg-background text-foreground">
                <Card.Root class="p-6 rounded-lg">
                    <Card.Header class="font-bold mb-5">
                        <Card.Title>{editForm ? 'Update Lookbook' : 'New Lookbook'}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                            <div class="mb-3">
                                <Label for="name">Name</Label>
                                <Input id="name" bind:value={lookbookDetails.name} placeholder="Name" class="input"/>
                            </div>
                            <div class="mb-3">
                                <Label for="variants">Variants</Label>
                                <Input id="variants" bind:value={lookbookDetails.variants} placeholder="Variants" class="input"/>
                            </div>                
                    </Card.Content>
                    <Card.Footer  class="justify-between space-x-2">
                        <Button type="button" variant="ghost" on:click={() => dispatch("cancel")}>Cancel</Button>
                        <Button type="submit"  on:click={createLookbook}>Save</Button>
                    </Card.Footer>
                </Card.Root>
           </div>
       </div>
   </div>
</div>

