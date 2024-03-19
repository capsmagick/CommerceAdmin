<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import LookbookTable from "./lookbookTable.svelte";

</script>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center ">
      <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 flex-1">Lookboook</h4>
      <div class="glow-border mr-4">
        <Button variant="outline" class="glow-border-content">Export</Button>
      </div>
      <div class="glow-border mr-4">
        <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5">

        
        <i class="fa-solid fa-cloud-arrow-up text-sm"></i>
        Add Lookbook</Button>
        </div>
  </div>
  <LookbookTable />
</div>

