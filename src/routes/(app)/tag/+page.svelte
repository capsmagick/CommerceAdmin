<script lang="ts">
  /** @type {import('./$types').PageData} */
  import { onMount } from "svelte";
  import { goto } from "$app/navigation"
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import TagTable from "./tagTable.svelte";

</script>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center ">
      <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 flex-1">Tag</h4>
      <div class="glow-border mr-4">
        <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5">Export Tag</Button>
      </div>
     
  </div>
  <TagTable />
</div>