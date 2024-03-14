<script lang="ts">
  import OrderTable from "./orderTable.svelte";
  import { Button } from "$lib/components/ui/button";

    
</script>

    <div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border" style="height: calc(100vh - 80px);">
        <div class="flex items-center justify-between">
            <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200">Orders</h4>
            <Button variant="outline" class=" mr-4  ">Export Customers</Button>
        </div>
        <OrderTable />
    </div>
