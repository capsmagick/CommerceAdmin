<script lang="ts">
      import { Button } from "$lib/components/ui/button";
  import ProductReportTable from "./productReportTable.svelte";

</script>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center justify-between">
      <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200">Product Report</h4>
      <div class="glow-border mr-4">
        <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5">Export Product Report</Button>
      </div>
     
  </div>
  <ProductReportTable />
</div>