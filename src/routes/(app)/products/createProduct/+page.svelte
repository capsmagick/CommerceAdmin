<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Input} from "$lib/components/ui/input"; 
  import {Textarea} from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import {Button} from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { Label } from "$lib/components/ui/label";

  const dispatch = createEventDispatcher();

  let productDetails = {
    name: '',
    shortDescription: '',
    description: '',
    sku: '',
    price: 0,
    sellingPrice: 0,
    condition: '',
    categories: [],
    brand: '',
    isDisabled: false,
    hsnCode: '',
    rating: 0,
    noOfReviews: 0,
    tags: [],
    dimension: '',
  };
  interface Category {
    id: number;
    name: string;
  }
  let categories: Category[] = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Home & Kitchen" },
    { id: 4, name: "Beauty & Personal Care" },
    { id: 5, name: "Books" },
    { id: 6, name: "Sports & Outdoors" },
  ];

  async function createProduct() {
    try {
      await API.post("/products/product/create_record/", productDetails);
      dispatch("newProduct");
    } catch (error) {
      console.error("create:product:", error);
    }
  }
  // Function to handle category selection change
function handleCategoryChange(selectedCategory: { value: number }) {
  productDetails.categories = [selectedCategory.value] as any;
}
</script>
<div class="container mx-auto max-w-4xl glow-border">
<div class="glow-border-content  bg-background text-foreground ">
  <h2 class="text-3xl font-bold mb-6 text-center">Add Product</h2>
  <form on:submit|preventDefault={createProduct} class="space-y-6  rounded px-8 pt-6 pb-8 mb-4">
    <div class="grid grid-cols-2 gap-4">
      <div class="grid grid-cols-2 gap-4">
        <Label for="name" class="text-right">Name</Label>
        <Input bind:value={productDetails.name} placeholder="Name" class="input" style="width: 100%; height: 2rem;" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <Label for="shortDescription" class="text-right">Short Description</Label>
        <Textarea bind:value={productDetails.shortDescription} placeholder="Short Description" class="textarea" style="width: 100%; height: 2rem;" />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="grid grid-cols-2 gap-4">
        <Label for="description" class="text-right">Description</Label>
        <Textarea bind:value={productDetails.description} placeholder="Description" class="textarea" style="width: 100%; height: 2rem;" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <Label for="category" class="text-right">Category</Label>
        <Select.Root>
          <Select.Trigger class="input">Select a Category</Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each categories as category}
              <Select.Item value={category.id} label={category.name} on:click={() => handleCategoryChange({value: category.id})}>
                {category.name}
              </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="grid grid-cols-2 gap-4">
        <Label for="sku" class="text-right">SKU</Label>
        <Input bind:value={productDetails.sku} placeholder="SKU" class="input" style="width: 100%; height: 2rem;" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <Label for="price" class="text-right">Price</Label>
        <Input type="number" bind:value={productDetails.price} placeholder="Price" class="input" style="width: 100%; height: 2rem;" />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="grid grid-cols-2 gap-4">
        <Label for="sellingPrice" class="text-right">Selling Price</Label>
        <Input type="number" bind:value={productDetails.sellingPrice} placeholder="Selling Price" class="input" style="width: 100%; height: 2rem;" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <Label for="condition" class="text-right">Condition</Label>
        <Input bind:value={productDetails.condition} placeholder="Condition" class="input" style="width: 100%; height: 2rem;" />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="grid grid-cols-2 gap-4">
        <Label for="brand" class="text-right">Brand</Label>
        <Input bind:value={productDetails.brand} placeholder="Brand" class="input" style="width: 100%; height: 2rem;" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <Label for="hsnCode" class="text-right">HSN Code</Label>
        <Input bind:value={productDetails.hsnCode} placeholder="HSN Code" class="input" style="width: 100%; height: 2rem;" />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="grid grid-cols-2 gap-4">
        <Label for="dimension" class="text-right">Dimension</Label>
        <Input bind:value={productDetails.dimension} placeholder="Dimension" class="input" style="width: 100%; height: 2rem;" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <Label for="submit" class="text-right"></Label>
        <Button type="submit" class="btn" style="width: 100%; height: 2rem;">Submit</Button>
      </div>
    </div>
  </form>
</div>
</div>

<style>
  .input, .textarea, .select, .btn {
    width: 100%;
    padding: 0.5rem;
    margin: 0.5rem 0;
    box-sizing: border-box;
    border: 2px solid #e2e8f0;
    border-radius: 0.375rem; /* 6px */
  }

  .btn {
    background-color: #4f46e5; /* Indigo */
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn:hover {
    background-color: #4338ca; /* Darker Indigo */
  }
</style>