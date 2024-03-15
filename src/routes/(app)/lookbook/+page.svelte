<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import LookbookTable from "./lookbookTable.svelte";
    // import type { PageData } from './$types';
    
    // export let data: PageData;
</script>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center ">
      <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 flex-1">Lookboook</h4>
      <Button variant="outline" class=" mr-4 ">Export</Button>
      <Button class="text-xs flex items-center gap-2 border  px-4 py-1.5 ">
        <i class="fa-solid fa-cloud-arrow-up text-sm"></i>
        Add Lookbook</Button>
  </div>
  <LookbookTable />
</div>

