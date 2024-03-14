<script lang="ts">
 import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import CollectionTable from "./collectionTable.svelte";
</script>
<div class="m-3">
    <div
      class="bg-white rounded-md p-4 px-6 border overflow-y-auto"
      style="height: calc(100vh - 58px);"
    >
     
        <div>
          <div class="flex items-center justify-between">
            <h4 class="text-lg font-medium text-gray-800">Collection</h4>
            <div class="flex items-center gap-2">
              <button
                class="text-xs flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-1.5 rounded"
              >
                <span>
                  <i class="fa-solid fa-cloud-arrow-up text-sm"></i>
                </span>Import Collection</button
              >
              <div class="flex items-center justify-between">
                  
                <Button>Export Collection</Button>
            </div>
              <Button
                class="text-xs flex items-center gap-2 border  px-4 py-1.5 rounded"
                
              on:click={() => goto('/collection/createCollection')}
              >
              <i class="fa-solid fa-plus text-sm"></i>
              New Collection
            </Button>
              
            </div>
          </div>
          <!-- Table -->
          <div class="m-3">
            <div class="bg-white rounded-md p-4 px-6 border" style="height: calc(100vh - 80px);">
                
                <CollectionTable />
            </div>
        </div>
        </div>
    </div>
  </div>