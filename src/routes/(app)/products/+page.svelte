<script lang="ts">
  // import { onMount } from "svelte";
  // import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import ProductTable from "./productTable.svelte";

    let showForm: boolean = false;

    function toggleForm() {
      showForm = !showForm
    }

  // let products:any[] = [];
  
  // async function fetchProducts(){
  //   try {
  //     const res = await API.get("/products/product/")
  //     products = res.data.results || [];
  //   } catch (error) {
  //     console.log("fetch:products:", error)
  //   }
  // }

  // // Mount
  // onMount(async() => {
  //   await fetchProducts()
  // })
</script>

<div class="m-3  shadow-md glow-border">
  <div class=" bg-background text-foreground p-4 px-6 glow-border-content">
  <div class="flex items-center ">
      <h2 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Products</h2>
      <div class="glow-border mr-4">
        <Button variant="outline" class="glow-border-content">Export Products</Button>
      </div>
      <div class="glow-border mr-4">
      <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={() => toggleForm()}>
        <i class="fa-solid  fa-cloud-arrow-up text-sm"></i>
        Add Products</Button>
      </div>
  </div>
  <ProductTable {showForm} on:cancel={() => showForm=false}/>
  </div>
  </div>