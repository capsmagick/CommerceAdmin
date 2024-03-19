<script lang="ts">
  import OrderTable from "./orderTable.svelte";
  import { Button } from "$lib/components/ui/button";

    
</script>
    <div class="m-3 glow-border">
    <div class=" bg-background glow-border-content text-foreground  p-4 px-6" style="height: calc(100vh - 80px);">
        <div class="flex items-center justify-between">
            <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200">Orders</h4>
            <div class="glow-border mr-4">
                <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5">Export Customers</Button>
            </div>
           
        </div>
        <OrderTable />
    </div>
</div>
