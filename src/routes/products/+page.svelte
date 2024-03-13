<script lang="ts">
  import { onMount } from "svelte";
  import API from "../../services/api";

  import ProductForm from "../../components/Products/ProductForm.svelte";
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
  let products: any[] = []

  // 
  async function fetchProducts(){
    try {
      const res = await API.get("/products/product/")
      products = res.results
    } catch (error) {
      console.log("fetch:products:", error)
    }
  }

  // Mount
  onMount(async() => {
    await fetchProducts()
  })
</script>

<div class="m-3">
  <div
    class="bg-white rounded-md p-4 px-6 border overflow-y-auto"
    style="height: calc(100vh - 58px);"
  >
    {#if !showForm}
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
            <button
              class="text-xs flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-1.5 rounded"
            >
              <span>
                <i class="fa-solid fa-cloud-arrow-down text-sm"></i>
              </span>Export Product</button
            >
            <button
              class="text-xs flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-1.5 rounded"
              on:click={() => (showForm = true)}
            >
              <span>
                <i class="fa-solid fa-plus text-sm"></i>
              </span> New Product</button
            >
          </div>
        </div>
        <!-- Table -->
        <div class="pt-8">
          <div
            class="grid bg-slate-200 px-4 py-2 rounded-md text-xs font-semibold text-gray-600"
            style="grid-template-columns: 1fr 200px 200px 200px 200px 100px;"
          >
            <div>Name</div>
            <div>Collection</div>
            <div>Status</div>
            <div>Availability</div>
            <div>Inventory</div>
            <div>Actions</div>
          </div>
          <div class="flex flex-col pt-6 gap-1">
            {#each products as product, i}
              <div
                class="grid bg-slate-200 px-4 py-2 rounded-md text-xs text-gray-500"
                style="grid-template-columns: 1fr 200px 200px 200px 200px 100px;"
              >
                <div class="font-semibold">{ product.name}</div>
                <div>-</div>
                <div>Published</div>
                <div>Default Sales Channel</div>
                <div>10 in stock for 1 variant(s)</div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {:else}
      <ProductForm on:close={() => showForm = false}/>
    {/if}
  </div>
</div>
