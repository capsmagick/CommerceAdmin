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
  import { writable } from "svelte/store";
  import { toast } from "svelte-sonner";
  import { Value } from "svelte-radix";

  const dispatch = createEventDispatcher();

  export let editForm: boolean;
  export let showModal;
  export let editData;
  let selectedItem: any;
  let selectedBrand: string;

    let productDetails: any = {
      id: '',
      name: '',
      short_description: '',
      description: '',
      sku: '',
      price: 0,
      selling_price: 0,
      condition: '',
      categories: [],
      brand: '',
      isDisabled: false,
      hsn_code: '',
      rating: 0,
      noOfReviews: 0,
      tags: [],
      dimension: '',
    };

    if (editForm) {
      productDetails = editData
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

  let condition: Condition[] = [
    { id: 1, name: "New" },
    { id: 2, name: "Refurbished" },
    { id: 3, name: "Factory Out" },
    { id: 4, name: "Used" },
  ];

  async function handleConditionChange(event: any) {
    selectedItem = event.value;
    console.log(selectedItem);
  }

  async function createProduct() {
    try {
      const url = editForm
        ? `/products/product/${productDetails.id}/update_record/`
        : "/products/product/create_record/";

      if (editForm) {
        await API.put(url, productDetails);
      } else {
        await API.post(url, productDetails);
      }

      dispatch("newProduct");
      showModal = false;

      const action = editForm ? "Product Updated" : "Product Created";
      toast(`${action} successfully!`);
    } catch (error) {
      console.error("create:product:", error);
    }
  }

  function cancelModel() {
    productDetails = {
      id: '',
      name: '',
      image: '',
      short_description: '',
      description: '',
      sku: '',
      price: 0,
      selling_price: 0,
      condition: '',
      categories: [],
      brand: '',
      isDisabled: false,
      hsn_code: '',
      rating: 0,
      noOfReviews: 0,
      tags: [],
      dimension: '',
    };
    dispatch("cancel");
  }
  function handleClickOutside(event) {
    if (!event.target.closest(".card")) {
      cancelModel();
    }
  }

  onMount(() => {
    const timeout = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("click", handleClickOutside);
    };
  });

  // image upload
  let imageUpload: HTMLInputElement;

  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    if (imageUpload.files && imageUpload.files.length > 0) {
      productDetails.image = imageUpload.files[0];
      const img: HTMLImageElement | null = document.getElementById(
        "selected-logo"
      ) as HTMLImageElement;
      if (img) {
        img.src = window.URL.createObjectURL(productDetails.image);
      }
    }
  }
  function handleBrandChange(selectedBrandId: string) {
    const brandsArray = $brands;
    productDetails.brand = selectedBrandId;
    const foundBrand  = brandsArray.find((g: any) => g.id == selectedBrandId);
    if (foundBrand) {
      selectedBrand = foundBrand.name;
    }
  }
</script>

<div class="fixed bg-background inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
      <div class="flex items-center justify-center">
        <div class="glow-border" >
        <div class="card glow-border-content bg-background text-foreground overflow-y-auto" style="max-height:90vh;">
            
            <Card.Root>
                <Card.Header>
                    <Card.Title>Add Product</Card.Title>
                    <Card.Description>add product details</Card.Description>
                </Card.Header>
                <Card.Content class="grid gap-6">
                    <div class="grid grid-cols-3 gap-4">
                        <div class="grid gap-2">
                            <Label for="area">Product Name</Label>
                           <Input id="area" placeholder="name" bind:value={productDetails.name} />
                        </div>
                        <div class="grid gap-2">
                            <Label for="security-level">Category</Label>
                            <select id="category"class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 input dark:focus:border-blue-500" bind:value={productDetails.categories}  multiple>
                              <option value="" disabled selected>Select</option>
                              {#each $categories as Category}
                                <option value={Category.id}>{Category.name}</option>
                              {/each}
                            </select>
                            
                            
                        </div>
                        <div class="grid gap-2">
                            <Label for="security-level">Brand</Label>
                            <Select.Root>
                  <Select.Trigger class="input capitalize">
                    {selectedBrand
                      ? selectedBrand
                      : "Select a Brand"}
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      {#each $brands as brand}
                      <Select.Item value={brand.id} label={brand.name} class="capitalize card"
                        on:click={() => handleBrandChange( brand.id )}>
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
                        <Input id="subject" placeholder="short description of the product" bind:value={productDetails.short_description} />
                    </div>
                   
                    
                    <div class="grid gap-2">
                        <Label for="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Please include all information relevant to your product."
                            bind:value={productDetails.description}
                        />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="grid gap-2">
                            <Label for="area">Condition</Label>
                            <Select.Root 
                            onSelectedChange={handleConditionChange}>
                              <Select.Trigger class="w-[180px]">
                                <Select.Value placeholder="Select the Condition" />
                              </Select.Trigger>
                              <Select.Content>
                                <Select.Group>
                                  <Select.Label>Fruits</Select.Label>
                                  {#each condition as Condition}
                                  <Select.Item class="card"  value={Condition.id} label={Condition.name}
                                    >{Condition.name}</Select.Item
                                  >
                                {/each}
                                </Select.Group>
                              </Select.Content>
                              <Select.Input name="selectedCondition" bind:value={selectedItem} />
                            </Select.Root>
                        </div>
                        <div class="grid gap-2">
                            <Label for="area">Selling Price</Label>
                           <Input id="area" placeholder="name" bind:value={productDetails.selling_price} />
                        </div>
                        <div class="grid gap-2">
                            <Label for="area">Price</Label>
                           <Input id="area" placeholder="name" bind:value={productDetails.price} />
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="grid gap-2">
                            <Label for="area">HSN</Label>
                           <Input id="area" placeholder="name" bind:value={productDetails.hsn_code} />
                        </div>
                        <div class="grid gap-2">
                            <Label for="security-level">SKU</Label>
                            <Input id="area" placeholder="name" bind:value={productDetails.sku} />
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-4">
                        <div class="grid gap-2">
                            <Label for="area">Display Image</Label>
                           <Button id="area" variant ="outline" placeholder="name" 
                           on:click={pickAvatar}>
                           Upload Image
                        </Button>

                <div style="display:flex; justify-content: center; align-items: center; margin-top: 10px;">
                  <img
                    id="selected-logo"
                    style="height: 100px;"
                    alt=""
                    class:showImg={productDetails.image}
                    class:hideImg={!productDetails.image}
                    src=""/>
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
</style>