<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import LookbookTable from "./lookbookTable.svelte";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import API from "$lib/services/api";
  import { goto } from "$app/navigation";
  import { toast } from "svelte-sonner";

  function goBack() {
    goto("/lookbook");
  }
</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center">
    <h4 class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1">
      Lookbook
    </h4>
    <div class="glow-border mr-4">
      <Button variant="outline" class="glow-border-content">Export</Button>
    </div>
  </div>
  <LookbookTable />

  <div class="flex justify-end">
    <Button class="text-end" on:click={goBack}>Go Back</Button>
  </div>
</div>