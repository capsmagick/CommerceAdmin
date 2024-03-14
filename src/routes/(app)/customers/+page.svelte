<script lang="ts">
    import CustomerTable from './customerTable.svelte';
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";

</script>
<div class="m-3">
    <div
      class="bg-white rounded-md p-4 px-6 border overflow-y-auto"
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
                </span>Import Customers</button
              >
              <div class="flex items-center justify-between">
                  
                <Button>Export Customers</Button>
            </div>
              
            </div>
          </div>
          <!-- Table -->
          <div class="m-3">
            <div class="bg-white rounded-md p-4 px-6 border" style="height: calc(100vh - 80px);">
                
                <CustomerTable />
            </div>
        </div>
        </div>
    </div>
  </div>

