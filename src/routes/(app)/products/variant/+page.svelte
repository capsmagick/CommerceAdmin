<script lang="ts">
  /** @type {import('./$types').PageData} */
  import { goto } from "$app/navigation"
  import { Button } from "$lib/components/ui/button";
  import VariantTable from "./variantTable.svelte";

  let showForm: boolean = false;
  let productID: any;

  function toggleForm() {
    showForm = !showForm
  }

  const urlParams = new URLSearchParams(window.location.search);
  productID = urlParams.get('product');
  console.log("Product ID from URL:", productID);

  if (productID) {
    sessionStorage.setItem('productId', productID);
  } else {
    productID = sessionStorage.getItem('productId');
  }

  function goBack() {
    goto("/products");
  }

</script>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center ">
      <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Variant</h4>
      <div class="glow-border mr-4">
      <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={() => toggleForm()}>
        <i class="fa-solid  fa-cloud-arrow-up text-sm"></i>
        Add Variant</Button>
      </div>
  </div>
  <VariantTable {showForm} on:cancel={() => showForm=false}/>
  <div class="flex justify-end">
    <Button class="text-end"
    on:click={goBack}>Go Back</Button>
  </div>
</div>