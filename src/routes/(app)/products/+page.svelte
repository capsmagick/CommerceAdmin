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

<div class="m-3  bg-white text-black dark:bg-gray-900 dark:text-gray-200">
  <div
    class= " bg-white text-black dark:bg-gray-900 dark:text-gray-200 rounded-md p-4 px-6 border overflow-y-auto"
    style="height: calc(100vh - 58px);"
  >
   
      <div>
        <div class="flex items-center justify-between">
          <h4 class="text-lg font-medium text-gray-800">Products</h4>
          <div class="flex items-center gap-2">
            <button
              class="text-xs flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-1.5 rounded"
            >
              <span>
                <i class="fa-solid fa-cloud-arrow-up text-sm"></i>
              </span>Import Product</button
            >
            <div class="flex items-center justify-between">
                
              <Button>Export Orders</Button>
          </div>
            <Button
              class="text-xs flex items-center gap-2 border  px-4 py-1.5 rounded"
              
            on:click={() => goto('products/createProduct')}
            >
            <i class="fa-solid fa-plus text-sm"></i>
            New Product
          </Button>
            
          </div>
        </div>
        <!-- Table -->
        <div class="m-3">
          <div class=" rounded-md p-4 px-6 border  bg-white text-black dark:bg-gray-900 dark:text-gray-200" style="height: calc(100vh - 80px);">
              
              <ProductTable />
          </div>
      </div>
      </div>
  </div>
</div>
