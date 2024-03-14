<script lang="ts">
    import CustomerTable from './customerTable.svelte';
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";

</script>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border" style="height: calc(100vh - 80px);">
  <div class="flex items-center justify-between">
      <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200">Customers</h4>
      <Button>Export Customers</Button>
  </div>
  <CustomerTable />
</div>
