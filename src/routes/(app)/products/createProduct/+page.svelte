<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import { createEventDispatcher } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
  import { writable } from "svelte/store";
  import { toast } from "svelte-sonner";
  import { Value } from "svelte-radix";

  const dispatch = createEventDispatcher();

  export let editForm: boolean;
  export let editData: any;
  let selectedItem: any;
  let selectedBrand: string;
  let tags: any = [];
  let selectedTagGroups: string;
  let selectedCategory: string;
  let editBrand: boolean = false;
  let editCategory: boolean = false;
  let editTag: boolean = false;
  let tagInput: string = ''; // Holds the raw tag input from the user

  // This function processes the tag input when the user types or pastes the tags
  

  let productDetails: any = {
    id: "",
    name: "",
    short_description: "",
    description: "",
    sku: "",
    price: "",
    selling_price: "",
    categories: [],
    brand: "",
    is_disabled: false,
    hsn_code: "",
    rating: 0,
    noOfReviews: 0,
    tags: [],
    dimension: "",
    images: "",
  };

  if (editForm) {
    productDetails = editData;
  }

  type Brand = {
    id: string;
    name: string;
    logo: string;
    description: string;
  };

  type Condition = {
    id: number;
    name: string;
  };

  type Categories = {
    id: string;
    name: string;
    description: string;
    tags: string[]; // Corrected type
    Image: string;
    status: string[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
  };

  export const brands = writable<Brand[]>([], (set) => {
    getBrands().then((data) => {
      set(data);
    });
  });

  async function getBrands() {
    try {
      const response = await API.get("/masterdata/brand/");
      return response.data.results;
    } catch (error) {
      console.error("fetch:brands:", error);
      return [];
    }
  }

  async function getCategory() {
    try {
      const res = await API.get("/masterdata/category/");
      return res.data.results;
    } catch (error) {
      console.error("fetch:brands:", error);
      return [];
    }
  }

  let categories = writable<Categories[]>([], (set) => {
    getCategory().then((data) => {
      set(data);
    });
  });

  async function fetchTags() {
    try {
      const res = await API.get("/masterdata/tag/");
      tags = res.data.results;
    } catch (error) {
      console.log("category:fetch-tags:", error);
    }
  }

  // function handleTagChange(selectedTags: { value: number }) {
  //   editTag = true;
  //   selectedTagGroups = tags.find((g: any) => g.id == selectedTags.value);
  //   productDetails.tags = selectedTagGroups.id;
  // }

  function handleCategoryChange(selectedCategoryId: string) {
    editCategory = true;
    productDetails.categories = selectedCategoryId;
    const categoriesArray = $categories;
    const foundCategory = categoriesArray.find((category: any) => category.id === selectedCategoryId);
    if (foundCategory) {
      selectedCategory = foundCategory.name;
    }
  }

  function handleBrandChange(selectedBrandId: string) {
    editBrand = true;
    const brandsArray = $brands;
    productDetails.brand = selectedBrandId;
    const foundBrand = brandsArray.find((g: any) => g.id == selectedBrandId);
    if (foundBrand) {
      selectedBrand = foundBrand.name;
    }
  }

  function toggleDisabled() {
    productDetails.is_disabled = !productDetails.is_disabled;
  }
  $: productDetails.tags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

  async function createProduct() {
    try {
      const form = new FormData();
      if (!editBrand) {
        productDetails.brand = productDetails.brand.id;
      }
      form.append("name", productDetails.name);
      form.append("short_description", productDetails.short_description);
      form.append("description", productDetails.description);
      form.append("sku", productDetails.sku);
      form.append("price", productDetails.price);
      form.append("selling_price", productDetails.selling_price);
      form.append("condition", productDetails.condition);
      form.append("categories", productDetails.categories);
      form.append("brand", productDetails.brand);
      form.append("is_disabled", productDetails.is_disabled);
      form.append("hsn_code", productDetails.hsn_code);
      form.append("rating", productDetails.rating);
      form.append("noOfReviews", productDetails.noOfReviews);
      if (editTag) {
        form.append("tags", productDetails.tags);
      }
      //  form.append("dimension", productDetails.dimension);
      form.append("images", productDetails.images);
      
      const url = editForm
        ? `/products/product/${productDetails.id}/update_record/`
        : "/products/product/create_record/";

      if (editForm) {
        await API.put(url, form);
      } else {
        await API.post(url, form);
      }

      dispatch("newProduct");

      const action = editForm ? "Product Updated" : "Product Created";
      toast(`${action} successfully!`);
    } catch (error) {
      console.error("create:product:", error);
    }
  }

  function cancelModel() {
    editBrand = false;
    editCategory = false;
    editCategory = false;
    dispatch("cancel");
  }
  function handleClickOutside(event: any) {
    if (!event.target.closest(".card")) {
      cancelModel();
    }
  }
  onMount(async () => {
    await fetchTags();
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

  // image upload
  let imageUpload: HTMLInputElement;

  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    if (imageUpload.files && imageUpload.files.length > 0) {
      productDetails.images = imageUpload.files[0];
      const img: HTMLImageElement | null = document.getElementById(
        "selected-logo"
      ) as HTMLImageElement;
      if (img) {
        img.src = window.URL.createObjectURL(productDetails.images);
      }
    }
  }
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
          <Card.Header>
            <Card.Title>Add Product</Card.Title>
            <Card.Description>add product details</Card.Description>
          </Card.Header>
          <Card.Content class="grid gap-6">
            <div class="grid grid-cols-3 gap-4">
              <div class="grid gap-2">
                <Label for="area">Product Name</Label>
                <Input
                  id="area"
                  placeholder="name"
                  bind:value={productDetails.name}
                />
              </div>
              <div class="grid gap-2">
                <Label for="security-level">Category</Label>
                <Select.Root>
                  <Select.Trigger class="input capitalize">
                    {selectedCategory ? selectedCategory : "Select a Category"}
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      {#each $categories as category}
                        <Select.Item
                          value={category.id}
                          label={category.name}
                          class="capitalize card"
                          on:click={() => handleCategoryChange(category.id)}>
                          {category.name}
                        </Select.Item>
                      {/each}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>
              <div class="grid gap-2">
                <Label for="security-level">Brand</Label>
                <Select.Root>
                  <Select.Trigger class="input capitalize">
                    {selectedBrand ? selectedBrand : "Select a Brand"}
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      {#each $brands as brand}
                        <Select.Item
                          value={brand.id}
                          label={brand.name}
                          class="capitalize card"
                          on:click={() => handleBrandChange(brand.id)}>
                          {brand.name}
                        </Select.Item>
                      {/each}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
            <div class="grid gap-2">
              <Label for="subject">Short description</Label>
              <Input
                id="subject"
                placeholder="short description of the product"
                bind:value={productDetails.short_description}
              />
            </div>

            <div class="grid gap-2">
              <Label for="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please include all information relevant to your product."
                bind:value={productDetails.description}
              />
            </div>
            <div class="grid gap-2">
              {#if editForm}
                <div class="grid gap-2">
                  <Label for="area">Status</Label>
                  <Toggle
                    aria-label="Toggle italic"
                    class={!productDetails.is_disabled
                      ? "bg-lime-600"
                      : "bg-gray-300"}
                    bind:value={productDetails.is_disabled}
                    on:click={toggleDisabled}
                  >
                    {productDetails.is_disabled ? "Inactive" : "Active"}
                  </Toggle>
                </div>
              {/if}
            </div>

              <div class="grid grid-cols-2 gap-2">
                <div class="grid gap-2">
                  <Label for="area">Selling Price</Label>
                  <div class="relative">
                    <Input
                    id="area"
                    class="pl-8"
                    type="number"
                    placeholder="Selling Price"
                    bind:value={productDetails.selling_price}/>
                    <span class="absolute inset-y-0 left-0 flex items-center pl-2">&#x20B9;</span>
                  </div>
                </div>
                <div class="grid gap-2">
                  <Label for="area">MRP</Label>
                  <div class="relative">
                    <Input
                      id="area"
                      class="pl-8" 
                      type="number"
                      placeholder="MRP"
                      bind:value={productDetails.price}/>
                    <span class="absolute inset-y-0 left-0 flex items-center pl-2">&#x20B9;</span>
                  </div>
                </div>
              </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Label for="area">HSN</Label>
                <Input
                  id="area"
                  placeholder="HSN Code"
                  bind:value={productDetails.hsn_code}
                />
              </div>
              <div class="grid gap-2">
                <Label for="security-level">SKU</Label>
                <Input
                  id="area"
                  placeholder="SKU"
                  bind:value={productDetails.sku}
                />
              </div>
            </div>
            <div class="items-center gap-2 mb-3">
              <Label for="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas"
                bind:value={tagInput}
                 />
            </div>
            {#if !editForm}
            <div class="grid grid-cols-1 gap-4">
              <div class="grid gap-2">
                <Label for="area">Display Image</Label>
                <Button
                  id="area"
                  variant="outline"
                  placeholder="name"
                  on:click={pickAvatar}>
                  Upload Image
                </Button>
                <div
                style="display:flex; justify-content: center; align-items: center; margin-top: 10px;">
                {#if productDetails.images}
                  <img
                    id="selected-logo"
                    style="height: 100px;"
                    alt=""
                    class:showImg={productDetails.images}
                    class:hideImg={!productDetails.images}
                    src={productDetails.images ? window.URL.createObjectURL(productDetails.images) : ''}/>
                    {/if}
                </div>
                <input
                  type="file"
                  id="file-input"
                  bind:this={imageUpload}
                  hidden
                  accept="image/png, image/jpeg"
                  on:change={uploadAvatar}/>
              </div>
            </div>
            {/if}
          </Card.Content>
          <Card.Footer class="justify-between space-x-2">
            <Button variant="ghost" on:click={() => cancelModel()}
              >Cancel</Button>
            <Button on:click={() => createProduct()}>Save</Button>
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
  /* .input, .textarea, .select, .btn {
    width: 100%;
    padding: 0.5rem;
    margin: 0.5rem 0;
    box-sizing: border-box;
    border: 2px solid #e2e8f0;
    border-radius: 0.375rem; /* 6px 
  } */

  /* .btn {
    background-color: #4f46e5; /* Indigo 
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn:hover {
    background-color: #4338ca; /* Darker Indigo 
  } */
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