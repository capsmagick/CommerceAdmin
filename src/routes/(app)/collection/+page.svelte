<script lang="ts">
 import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import CollectionTable from "./collectionTable.svelte";
</script>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border" style="height: calc(100vh - 80px);">
  <div class="flex items-center justify-between">
      <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200">Collection</h4>
      <Button variant="outline" class=" mr-4  ">Export Collection</Button>
  </div>
  <CollectionTable />
</div>

