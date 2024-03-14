<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import LookbookTable from "./lookbookTable.svelte";
    // import type { PageData } from './$types';
    
    // export let data: PageData;
</script>
<div class="m-3">
  <div
    class="bg-white rounded-md p-4 px-6 border overflow-y-auto"
    style="height: calc(100vh - 58px);"
  >
   
      <div>
        <div class="flex items-center justify-between">
          <h4 class="text-lg font-medium text-gray-800">Lookbook</h4>
          <div class="flex items-center gap-2">
            <div class="flex items-center justify-between">
                
              <Button>Export</Button>
          </div>
            <Button
              class="text-xs flex items-center gap-2 border  px-4 py-1.5 rounded">
            <i class="fa-solid fa-plus text-sm"></i>
            New Variant
          </Button>
            
          </div>
        </div>
        <!-- Table -->
        <div class="m-3">
          <div class="bg-white rounded-md p-4 px-6 border">
              
              <LookbookTable />
          </div>
      </div>
      </div>
  </div>
</div>

