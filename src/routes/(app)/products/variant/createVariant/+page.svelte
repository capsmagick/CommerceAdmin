<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import { toast } from "svelte-sonner";
  import * as Card from "$lib/components/ui/card";
  import { productDetailsStore } from "$lib/stores/data";

  const dispatch = createEventDispatcher();

  interface AttributeDetail {
    id: number;
    name: string;
    values: string[];
  }

  export let editData: any;
  export let editForm: boolean;
  export let productID: any;
  let attributegroup: any;
  let attributeDetails: AttributeDetail[] = [];
  let selectedAttributeValues = new Map();
  let imageUpload: any;
  let updateImage: boolean = false
  let productData: any;
  let categoriesArray: any;
  let attribute_group: any;
  let isSubscribed = false;
  let unsubscribe: () => void;

  let variantDetails: any = {
    product: "",
    attributes: [],
    stock: "",
    selling_price: "",
    images: "",
  };

  if (editForm) {
    variantDetails = editData;
  }
  if (productID) {
    variantDetails.product = productID;
  }

  onMount(() => {
    const persistedAttributeGroup = localStorage.getItem("attribute_group");
    if (persistedAttributeGroup) {
        attribute_group = parseInt(persistedAttributeGroup);
    }
    
    if(!isSubscribed) {
      unsubscribe = productDetailsStore.subscribe((value) => {
        productData = value;
        categoriesArray = productData.categories;
        // attribute_group = categoriesArray[0].attribute_group.id;
        if (categoriesArray && categoriesArray.length > 0) {
                attribute_group = categoriesArray[0].attribute_group.id;
                localStorage.setItem("attribute_group", attribute_group);
            }
      });
    isSubscribed = true;
    }

    if (editData && editData.attributes) {
      variantDetails.attributes = editData.attributes.map((attr: {
        attributes: { id: number },
        value: string,
        id: number
      }) => ({
        attribute: attr.attributes.id,
        value: attr.value,
        id: attr.id
      }));
    }
  });

  async function handleAttributeGroupData() {
    try {
      console.log("attrbuteGroup here:", attribute_group);
      if (attribute_group) {
        await fetchAttributegroup();
        if (attributegroup) {
          const matchedGroup = attributegroup.find(
            (group: any) => group.id === attribute_group
          );
          if (matchedGroup) {
            const { name, attributes } = matchedGroup;
            attributeDetails = [];
            attributes.forEach((attr: any) => {
              if (
                attr.value &&
                Array.isArray(attr.value) &&
                attr.value.length > 0
              ) {
                const values = attr.value[0].split(",");
                attributeDetails.push({
                  id: attr.id,
                  name: attr.name,
                  values: values,
                });
              } else {
                console.log(
                  "Attribute Values:",
                  "No values found or not an array"
                );
              }
            });
          }
        }
      }
    } catch (error) {
      console.log("handleAttributeGroupData:", error);
    }
  }

  function handleAttributeValueChange(attributeId: number, attributeName: string, value: string) {
      selectedAttributeValues.set(attributeName, value);
      selectedAttributeValues = new Map(selectedAttributeValues);
      const existingIndex = variantDetails.attributes.findIndex((attr: { attribute: number, value: string, id?: number }) => attr.attribute === attributeId);
      if (existingIndex !== -1) {
        if (editForm) {
          variantDetails.attributes[existingIndex] = { attribute: attributeId, value: value, id: variantDetails.attributes[existingIndex].id };
        } else {
          variantDetails.attributes[existingIndex].value = value;
        }
      } else {
        variantDetails.attributes.push({ attribute: attributeId, value: value });
      }
  }

  async function fetchAttributegroup() {
    try {
      const res = await API.get("/masterdata/attributegroup/");
      attributegroup = res.data.results;
    } catch (error) {
      console.log("category:fetch-attribute-group:", error);
    }
  }

  async function createVariant() {
    try {
      debugger;
      console.log("Variant Details before API call:", variantDetails);
      const form = new FormData();
      form.append("product", variantDetails.product);
      form.append("stock", variantDetails.stock);
      form.append("selling_price", variantDetails.selling_price);
      form.append("attributes", JSON.stringify(variantDetails.attributes));
      if (updateImage && variantDetails.images){
        form.append("images", variantDetails.images);
      }

      console.log("image uploading:", variantDetails.images)
      console.log("attributes:", variantDetails.attributes);
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
      debugger;
    } catch (error) {
      const action = editForm ? "Update Variant" : "Create Variant";
      console.log(`${action}:`, error);
      toast(`Failed to ${action}`);
    }
    onDestroy(() => {
        unsubscribe();
      });
  }

  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    updateImage = true;
    variantDetails.images = imageUpload.files[0];
    console.log("New image:", variantDetails.images);
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
    await fetchAttributegroup();
    await handleAttributeGroupData();
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
  style="background-color: rgba(0, 0, 0, 0.5);">
  <div class="flex items-center justify-center">
    <div class="glow-border">
      <div
        class="card glow-border-content bg-background text-foreground overflow-y-auto"
        style="max-height:90vh;">
        <Card.Root>
          <Card.Header class="font-bold mb-5">
            <Card.Title>
              {editForm ? "Update Variant" : "New Variant"}</Card.Title>
          </Card.Header>
          <Card.Content>
            {#each attributeDetails as detail}
              <div class="flex justify-center">
                <div class="mb-3" style="min-width: 100px; max-width: 200px;">
                  <Label>{detail.name}</Label>
                </div>
                <div class="mb-3 pl-4" style="min-width: 150px; max-width: 250px;">
                  <Select.Root>
                    <Select.Trigger class="input capitalize">
                      {#if selectedAttributeValues.has(detail.name)}
                        {selectedAttributeValues.get(detail.name)}
                      {:else}
                        {variantDetails.attributes.find(attr => attr.attribute === detail.id)?.value ?? 'Select an Attribute'}
                      {/if}
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Group>
                        {#each detail.values as value, index}
                          <Select.Item
                            value={index}
                            label={value}
                            class="capitalize card"
                            on:click={() =>
                              handleAttributeValueChange(
                                detail.id,
                                detail.name,
                                value
                              )}>
                            {value}
                          </Select.Item>
                        {/each}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>
            {/each}
            <div class="mb-3">
              <Label for="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                bind:value={variantDetails.stock}
                placeholder="Stock"/>
            </div>
            <div class="mb-3">
              <Label for="selling_price">Selling Price</Label>
              <Input
                id="selling_price"
                type="number"
                bind:value={variantDetails.selling_price}
                placeholder="Selling Price"/>
            </div>
            {#if !editForm}
            <div class="flex items-center justify-evenly gap-2">
              <Button
                type="button"
                class="btn flex gap-2 items-center bg-indigo-500 text-white text-xs"
                on:click={pickAvatar}>
                <i class="fa-solid fa-image text-sm"></i>
                Upload Variant image
              </Button>
              <img
                id="selected-logo"
                alt=""
                class={variantDetails.images ? "showImg" : "hideImg"}
                src={updateImage ? window.URL.createObjectURL(variantDetails.images) : variantDetails.images}/>
              <input
                type="file"
                id="file-input"
                hidden
                bind:this={imageUpload}
                on:input={uploadAvatar}
                accept="image/png, image/jpeg"/>
            </div>
            {/if}
          </Card.Content>
          <Card.Footer class="justify-between space-x-2">
            <Button
              type="button"
              variant="ghost"
              on:click={() => dispatch("close")}>Cancel</Button>
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
  .hideImg {
    visibility: hidden;
  }
  .showImg {
    display: block;
    height: 6rem;
    width: 6rem;
    flex: none;
    border-radius: 20px;
    object-fit: cover;
  }
</style>