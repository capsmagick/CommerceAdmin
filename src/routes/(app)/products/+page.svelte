<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import ProductTable from "./productTable.svelte";

 
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
</script>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border" style="height: calc(100vh - 80px);">
  <div class="flex items-center ">
      <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 flex-1">Products</h4>
      <Button variant="outline" class=" mr-4 ">Export Products</Button>
      <Button class="text-xs flex items-center gap-2 border  px-4 py-1.5 " on:click={() => goto('products/createProduct')}>
        <i class="fa-solid fa-cloud-arrow-up text-sm"></i>
        Add Products</Button>
  </div>
  <ProductTable />
</div>


   

