<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import ProductTable from "./productTable.svelte";
  import { createEventDispatcher } from "svelte";
    import { Input} from "$lib/components/ui/input"; 
    import {Textarea} from "$lib/components/ui/textarea";
    import * as Select from "$lib/components/ui/select";
    import { Label } from "$lib/components/ui/label";
    import * as Card from "$lib/components/ui/card";
    import { writable } from 'svelte/store';
    

    const dispatch = createEventDispatcher();
  
  let productDetails = {
      name: '',
      shortDescription: '',
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
   
    type Brand = {
        id: string;
        name: string;
        logo: string;
        description: string;
    };

    type Condition = {
        id: string;
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
            console.log(data);
            set(data);
        });
    });

    let condition: Condition[] = [
      { id: 1, name: "New" },
      { id: 2, name: "Refurbished" },
      { id: 3, name: "Factory Out" },
      { id: 4, name: "Used" },
      
    ];
 
  let a = [
    {
      name: "Product one",
    },
    {
      name: "Product two",
    },
    {
      name: "Product Three",
    },
    {
      name: "Product Five",
    },
  ];
  let showModal = false;
  let showForm = false;
   let products:any[] = [];

  // 
  async function fetchProducts(){
    try {
      const res = await API.get("/products/product/")
      products = res.data.results || [];
    } catch (error) {
      console.log("fetch:products:", error)
    }
  }

  // Mount
  onMount(async() => {
    await fetchProducts()

   
  })

  async function createProduct() {
      try {
        await API.post("/products/product/create_record/", productDetails);
        dispatch("newProduct");
      } catch (error) {
        console.error("create:product:", error);
      }
    }
     

</script>
<div class="m-3  shadow-md glow-border">
  <div class=" bg-background text-foreground p-4 px-6 glow-border-content">
  <div class="flex items-center ">
      <h2 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Products</h2>
      <div class="glow-border mr-4">
        <Button variant="outline" class="glow-border-content">Export Products</Button>
      </div>
      <div class="glow-border mr-4">
      <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={() => (showModal = true)}>
        <i class="fa-solid  fa-cloud-arrow-up text-sm"></i>
        Add Products</Button>
      </div>
  </div>
  <ProductTable />
  </div>
  </div>
  {#if showModal}
    <div class="fixed bg-background inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
      <div class="flex items-center justify-center">
        <div class="glow-border" >
        <div class="card glow-border-content bg-background text-foreground">
            
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
                            <select id="category" bind:value={productDetails.categories} class="input" multiple>
                              <option value="" disabled selected>Select</option>
                              {#each $categories as Category}
                                <option value={Category.id}>{Category.name}</option>
                              {/each}
                            </select>
                        </div>
                        <div class="grid gap-2">
                            <Label for="security-level">Brand</Label>
                            <select id="brand" bind:value={productDetails.brand} class="input">
                              <option value="" disabled selected>Select</option>
                              {#each $brands as brand}
                                <option value={brand.id}>{brand.name}</option>
                              {/each}
                            </select>
                        </div>
                   
                    </div>
                    <div class="grid gap-2">
                        <Label for="subject">Short description</Label>
                        <Input id="subject" placeholder="short description of the product" bind:value={productDetails.shortDescription} />
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
                            <select id="condition" bind:value={productDetails.condition} class="input">
                              <option value="" disabled selected>Select</option>
                              {#each condition as Category}
                                <option value={Category.name}>{Category.name}</option>
                              {/each}
                            </select>
                              
                        </div>
                        <div class="grid gap-2">
                            <Label for="area">Selling Price</Label>
                           <Input id="area" placeholder="name" bind:value={productDetails.selling_price} />
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
                           <Button id="area" variant ="outline" placeholder="name" >
                           Upload Image
                        </Button>
                        </div>
                       
                    </div>
            
                </Card.Content>
                <Card.Footer class="justify-between space-x-2">
                    <Button variant="ghost" on:click={() => (showModal = false)}>Cancel</Button>
                    <Button on:click={() => createProduct()}>Save</Button>
                </Card.Footer>
            </Card.Root>
    
        </div>
    </div>
    </div>
    </div>
  {/if}


   

