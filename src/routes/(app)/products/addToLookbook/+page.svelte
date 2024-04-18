<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { createEventDispatcher, onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { productIdStore } from "../../../../lib/stores/data";
  import { writable } from "svelte/store";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  const dispatch = createEventDispatcher();

  export let editData;
  export let editForm: boolean;
  let productId: any;
  let selectedVariant: string;

  type Variant = {
    id: string;
    name: string;
  };

  productIdStore.subscribe((value) => {
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
    lookbookDetails = editData;
  }
  async function getVariant() {
    try {
      const response = await API.get(`/products/variant/?product=${productId}`);
      return response.data.results;
    } catch (error) {
      console.error("fetch:Variant:", error);
    }
  }
  async function createLookbook() {
    try {
      const form = new FormData();

      form.append("name", lookbookDetails.name);
      // form.append("variants", JSON.stringify(lookbookDetails.variants));
      form.append("variants", lookbookDetails.variants);

      const url = editForm
        ? `/products/look-book/${lookbookDetails.id}/update_record/`
        : "/products/look-book/create_record/";

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

  function cancelModel() {
    dispatch("cancel");
  }

  function handleBrandChange(selectedVariantId: string) {
    const variantArray = $variants;
    lookbookDetails.variants = selectedVariantId;
    const foundBrand = variantArray.find((g: any) => g.id == selectedVariantId);
    if (foundBrand) {
      selectedVariant = foundBrand.name;
    }
  }
</script>

        <Dialog.Root
          open={true}
          onOpenChange={cancelModel}
          preventScroll={true}
        >
          <Dialog.Header class="font-bold mb-5">
            <Dialog.Title
              >{editForm ? "Update Lookbook" : "New Lookbook"}</Dialog.Title
            >
          </Dialog.Header>
          <Dialog.Content>
            <div class="mb-3">
              <Label for="name">Name</Label>
              <Input
                id="name"
                bind:value={lookbookDetails.name}
                placeholder="Name"
                class="input"
              />
            </div>
            <div class="grid gap-2">
              <Label for="security-level">Variant</Label>
              <Select.Root>
                <Select.Trigger class="input capitalize">
                  {selectedVariant ? selectedVariant : "Select a Variant"}
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {#each $variants as variant}
                      <Select.Item
                        value={variant.id}
                        label={variant.name}
                        class="capitalize card"
                        on:click={() => handleBrandChange(variant.id)}
                      >
                        {variant.name}
                      </Select.Item>
                    {/each}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
            <Dialog.Footer class="justify-between space-x-2">
              <Button
                type="button"
                variant="ghost"
                on:click={cancelModel}>Cancel</Button
              >
              <Button type="submit" on:click={createLookbook}>Save</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
