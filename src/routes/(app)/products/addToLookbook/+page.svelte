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
    import { productIdStore } from '../../../../lib/stores/data';
    import { writable } from "svelte/store";

    const dispatch = createEventDispatcher();

    export let editData;
    export let editForm: boolean;
    let productId: any;
    let selectedVariant: string;

    type Variant = {
    id: string;
    name: string;
  };

    productIdStore.subscribe(value => {
    productId = value;
    
    });

    export const variants = writable<Variant[]>([], (set) => {
    getVariant().then((data) => {
      set(data);
    });
  });

    let lookbookDetails = {
        id: "",
        name: "",
        variants: "",
    };

    if (editForm) {
        lookbookDetails = editData
    }
    async function getVariant() {
        try{
            const response = await API.get(`/products/variant/?product=${productId}`);
            return response.data.results;
        }
        catch (error) {
            console.error("fetch:Variant:", error);
        }
    }
    async function createLookbook() {
        try {
            const form = new FormData();

            form.append("name", lookbookDetails.name);
            // form.append("variants", JSON.stringify(lookbookDetails.variants));
            form.append("variants", lookbookDetails.variants);

            const url = editForm ? `/products/look-book/${lookbookDetails.id}/update_record/` : "/products/look-book/create_record/";

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
    function handleClickOutside(event: any) {
    if (!event.target.closest('.card')) {
      cancelDelete();
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

  function handleBrandChange(selectedVariantId: string) {
    const variantArray = $variants;
    lookbookDetails.variants = selectedVariantId;
    const foundBrand  = variantArray.find((g: any) => g.id == selectedVariantId);
    if (foundBrand) {
      selectedVariant = foundBrand.name;
    }
  }
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
                            <div class="grid gap-2">
                            <Label for="security-level">Variant</Label>
                            <Select.Root>
                  <Select.Trigger class="input capitalize">
                    {selectedVariant
                      ? selectedVariant
                      : "Select a Variant"}
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      {#each $variants as variant}
                      <Select.Item value={variant.id} label={variant.name} class="capitalize card"
                        on:click={() => handleBrandChange( variant.id )}>
                        {variant.name}
                      </Select.Item>
                      {/each}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
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

