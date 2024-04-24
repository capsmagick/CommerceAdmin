<script lang="ts">
  import { onMount } from "svelte";
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import { createEventDispatcher } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import { Label } from "$lib/components/ui/label";
  import { writable } from "svelte/store";
  import { toast } from "svelte-sonner";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  
  const dispatch = createEventDispatcher();

  export let editForm: boolean;
  export let editData: any;
  let selectedBrand: string;
  let tags: any = [];
  let selectedCategory: string;
  let editBrand: boolean = false;
  let editCategory: boolean = false;
  let editImage: boolean = false;
  let editTag: boolean = false;
  let tagInput: string = ""; // Holds the raw tag input from the user

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
    images: [],
  };

  const reactiveImages = writable([]);

  if (editForm) {
    console.log(editData);

    productDetails = editData;
    console.log(productDetails.is_disabled);
    selectedCategory = productDetails.categories[0]
      ? productDetails.categories[0].name
      : "";
    selectedBrand = productDetails.brand ? productDetails.brand.name : "";
    tagInput = productDetails.tags.map((tag: any) => tag).join(",");
  }

  type Brand = {
    id: string;
    name: string;
    logo: string;
    description: string;
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

  function handleCategoryChange(selectedCategoryId: string) {
    editCategory = true;
    productDetails.categories = selectedCategoryId;
    const categoriesArray = $categories;
    const foundCategory = categoriesArray.find(
      (category: any) => category.id === selectedCategoryId
    );
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

  $: productDetails.tags = tagInput
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");

  async function createProduct() {
    try {
      const form = new FormData();
      console.log(productDetails.is_disabled);
      if (!editBrand) {
        productDetails.brand = productDetails.brand.id;
      }
      if (!editCategory) {
        productDetails.categories = productDetails.categories[0].id;
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
      if (editImage) {
        for (let i = 0; i < productDetails.images.length; i++) {
          form.append("images", productDetails.images[i]);
        }
      }

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
    dispatch("cancel");
  }

  onMount(async () => {
    await fetchTags();
  });

  // image upload
  let imageUpload: HTMLInputElement;

  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    editImage = true;
    if (imageUpload.files && imageUpload.files.length > 0) {
      for (let i = 0; i < imageUpload.files.length; i++) {
        productDetails.images.push(imageUpload.files[i]);
      }
      // Update the reactiveImages store
      reactiveImages.set(productDetails.images);
      // Update the preview image with the last selected image
      const img: HTMLImageElement | null = document.getElementById("selected-logo") as HTMLImageElement;
      if (img) {
        img.src = window.URL.createObjectURL(productDetails.images[productDetails.images.length - 1]);
      }
      console.log("productDetails.images after update:", productDetails.images);
    }
  }
  function removeImage(index: any) {
    const newImages = [...$reactiveImages];
    newImages.splice(index, 1);
    reactiveImages.set(newImages);
    productDetails.images = newImages; // Update productDetails.images
  }
</script>

<Dialog.Root open={true} onOpenChange={cancelModel} preventScroll={true}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{editForm ? "Edit Product" : "Add Product"}</Dialog.Title>
    </Dialog.Header>

    <div class="grid grid-cols-4 gap-4">
      <div class="grid gap-2">
        <Label for="area">Product Name</Label>
        <Input id="area" placeholder="name" bind:value={productDetails.name} />
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
                  on:click={() => handleCategoryChange(category.id)}
                >
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
                  on:click={() => handleBrandChange(brand.id)}
                >
                  {brand.name}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
      <div class="grid gap-2">
        <Label for="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="Enter tags separated by commas"
          bind:value={tagInput}
        />
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

    <div class="grid grid-cols-2 gap-2">
      <div class="grid grid-cols-2 gap-2">
        <div class="grid gap-2">
          <Label for="area">Selling Price</Label>
          <div class="relative">
            <Input
              id="area"
              class="pl-8"
              type="number"
              placeholder="Selling Price"
              bind:value={productDetails.selling_price}
            />
            <span class="absolute inset-y-0 left-0 flex items-center pl-2"
              >&#x20B9;</span
            >
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
              bind:value={productDetails.price}
            />
            <span class="absolute inset-y-0 left-0 flex items-center pl-2"
              >&#x20B9;</span
            >
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
          <Input id="area" placeholder="SKU" bind:value={productDetails.sku} />
        </div>
      </div>
    </div>

    {#if !editForm}
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="area">Display Image</Label>
          <Button
            id="area"
            variant="outline"
            placeholder="name"
            on:click={pickAvatar}
          >
            Upload Image
          </Button>

          <input
            type="file"
            id="file-input"
            bind:this={imageUpload}
            hidden
            multiple
            accept="image/png, image/jpeg"
            on:change={uploadAvatar}
          />
        </div>
        <div
          style="display:flex; justify-content: center; align-items: center; margin-top: 10px;"
        >
        {#if productDetails.images.length > 0}
          <div class="image-preview-container">
            {#each $reactiveImages as image, index}
              <div class="image-container">
                <img
                  id="selected-logo-{index}"
                  class="selected-logo w-32 h-32 object-cover rounded-md"
                  alt=""
                  src={window.URL.createObjectURL(image)}
                />
                <button class="remove-btn" on:click={() => removeImage(index)}>
                  &times;
                </button>
              </div>
            {/each}
          </div>
        {/if}
        </div>
      </div>
    {/if}
    <Dialog.Footer class="justify-between space-x-2">
      <Button variant="ghost" on:click={() => cancelModel()}>Cancel</Button>
      <Button on:click={() => createProduct()}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<style>

  .image-preview-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .selected-logo {
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
  }

  .image-container {
    position: relative;
    display: inline-block;
  }

  .remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
  }
</style>
