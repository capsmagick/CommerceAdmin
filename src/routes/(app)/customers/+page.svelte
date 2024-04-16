<script lang="ts">
  import CustomerTable from "./customerTable.svelte";
  import { Button } from "$lib/components/ui/button";
</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center justify-between">
    <h4
      class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1"
    >
      Customers
    </h4>
    <div class="glow-border mr-4">
      <Button
        variant="outline"
        class="text-xs flex items-center gap-2  px-4 py-1.5"
        >Export Customers</Button
      >
    </div>
  </div>
  <CustomerTable />
</div>
