<script lang="ts">
  /** @type {import('./$types').PageData} */
  import { onMount } from "svelte";
  import { goto } from "$app/navigation"
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import VariantTable from "./variantTable.svelte";

  function goBack() {
    goto("/products");
  }

</script>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center ">
      <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Variant</h4>
  </div>
  <VariantTable />
  <div class="flex justify-end">
    <Button class="text-end"
    on:click={goBack}>Go Back</Button>
  </div>
</div>