<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { createEventDispatcher, onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import * as Card from "$lib/components/ui/card";
  import { productIdStore } from "../../../../../lib/stores/data";

  const dispatch = createEventDispatcher();

  export let editData;
  export let editForm: boolean;
  let attributes: number[] = [];
  let attribute: any[] = [];
  let selectedAttributes: number[] = [];
  let selectedAttributeNames: string[] = [];

  let variantDetails: any = {
    id: "",
    name: "",
    stock: "",
    selling_price: "",
    attributes: [],
    product: "",
  };

  productIdStore.subscribe((value) => {
    variantDetails.product = value;
  });
  if (editForm) {
    variantDetails = editData;
  }

  async function updateSelectedAttributeNames() {
    if (!attribute.length) await fetchAttribute();
    selectedAttributeNames = attribute
      .filter((attr) => selectedAttributes.includes(attr.id))
      .map((attr) => attr.name);
    console.log("att", selectedAttributeNames, attribute, selectedAttributes);
  }

  async function fetchAttribute() {
    try {
      const res = await API.get("/masterdata/attribute/");
      attribute = res.data.results;
    } catch (error) {
      console.log("category:fetch-attribute-group:", error);
    }
  }

  function handleAttributeChange(selectedAttribute: { value: number }) {
    const index = selectedAttributes.indexOf(selectedAttribute.value);
    if (index === -1) {
      selectedAttributes = [...selectedAttributes, selectedAttribute.value];
    } else {
      selectedAttributes.splice(index, 1);
    }
    variantDetails.attributes = selectedAttributes;
    console.log(variantDetails.attributes);

    updateSelectedAttributeNames();
  }

  async function createVariant() {
    try {
      console.log("variantDetails", variantDetails);
      const form = new FormData();
      form.append("stock", variantDetails.stock);
      form.append("name", variantDetails.name);
      form.append("selling_price", variantDetails.selling_price);
      form.append("attributes", variantDetails.attributes);
      form.append("product", variantDetails.product);

      const url = editForm
        ? `/products/variant/${variantDetails.id}/update_record/`
        : "/products/variant/create_record/";

      if (editForm) {
        await API.put(url, form);
      } else {
        await API.post(url, form);
      }

      dispatch("newVariant");
      const action = editForm ? "Variant Updated" : "Variant Created";
      toast(`${action} successfully!`);
    } catch (error) {
      const action = editForm ? "Update Variant" : "Create Variant";
      console.log(`${action}:`, error);
      toast(`Failed to ${action}`);
    }
  }

  function cancelModel() {
    dispatch("close");
  }
  function handleClickOutside(event: any) {
    if (!event.target.closest(".card")) {
      cancelModel();
    }
  }

  onMount(async () => {
    await fetchAttribute();
  });

  onMount(() => {
    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
</script>

<div
  class="fixed bg-background inset-0 flex items-center justify-center"
  style="background-color: rgba(0, 0, 0, 0.5);"
>
  <div class="flex items-center justify-center">
    <div class="glow-border">
      <div
        class="card glow-border-content bg-background text-foreground overflow-y-auto"
        style="max-height:90vh;"
      >
        <Card.Root>
          <Card.Header class="font-bold mb-5">
            <Card.Title
              >{editForm ? "Update Variant" : "New Variant"}</Card.Title
            >
          </Card.Header>
          <Card.Content>
            <div class="mb-3">
              <Label for="name">Name</Label>
              <Input
                id="name"
                bind:value={variantDetails.name}
                placeholder="Name"
                class="input"
              />
            </div>

            <div class="mb-3">
              <Label for="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                bind:value={variantDetails.stock}
                placeholder="Stock"
                class="textarea"/>
            </div>

            <div class="mb-3">
              <Label for="selling_price">Selling Price</Label>
              <Input
                id="selling_price"
                type="number"
                bind:value={variantDetails.selling_price}
                placeholder="Selling Price"
                class="textarea"/>
            </div>

            <div class="mt-2">
              <Select.Root>
                <Select.Trigger class="input capitalize">
                  {selectedAttributeNames.length > 0
                    ? selectedAttributeNames
                    : "Select an Attribute"}
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {#each attribute as a}
                      <Select.Item
                        value={a.id}
                        label={a.name}
                        class="capitalize card"
                        on:click={() => handleAttributeChange({ value: a.id })}>
                        {a.name}
                      </Select.Item>
                    {/each}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>

            <!-- <div class="mb-3">
                                <Label for="product">Product</Label>
                                <Textarea disabled id="product" bind:value={variantDetails.product} placeholder="Product" class="textarea"/>
                            </div> -->
          </Card.Content>
          <Card.Footer class="justify-between space-x-2">
            <Button
              type="button"
              variant="ghost"
              on:click={() => dispatch("close")}>Cancel</Button
            >
            <Button type="submit" on:click={createVariant}>Save</Button>
          </Card.Footer>
        </Card.Root>
      </div>
    </div>
  </div>
</div>

<style>
  .card::-webkit-scrollbar {
    display: none;
  }
</style>
