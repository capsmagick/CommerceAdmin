<script lang="ts">
      import { Button } from "$lib/components/ui/button";
  import StockAdjustmentTable from "./stockAdjustmentTable.svelte";

</script>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center justify-between">
      <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200">Stock Adjustments</h4>
      <Button>Export Stock Adjustments</Button>
  </div>
  <StockAdjustmentTable />
</div>