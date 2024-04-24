<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import LookbookTable from "./lookbookTable2.svelte";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import API from "$lib/services/api";
  import { goto } from "$app/navigation"
  import {toast} from "svelte-sonner";


    let showDeleteModal = false;
    let deletingLookbook: any;
    let refreshTable: any;
    let editData: any;
    let editForm: boolean = false;

        // Edit lookbook details
    async function onEditLookbook(eventData: any) {
        // editData = eventData.original;
        // editForm = true;
    }

    async function onDeleteLookbook(eventData: any) {
        // deletingLookbook = eventData.original;
        // showDeleteModal = true;
    }

    function confirmDelete() {
        API.delete(`/products/look-book/${deletingLookbook.id}/delete_record/`).then(() => {
            closeDeleteModal();
            toast("Lookbook Deleted Successfully!");
        }).catch((error) => {
            console.error("Error deleting Lookbook:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshTable.refreshTable();
    }

      function goBack() {
    goto("/lookbook");
  }

</script>
<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingLookbook.name} on:confirm={confirmDelete}
          on:cancel={closeDeleteModal}/>
    {/if}
</div>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center ">
      <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Lookbook</h4>
      <div class="glow-border mr-4">
        <Button variant="outline" class="glow-border-content">Export</Button>
      </div>
  </div>
  <!-- <LookbookTable    on:edit={(event) => onEditLookbook(event.detail.item.row)}
                    on:delete={(event) => onDeleteLookbook(event.detail.item.row)}
                    bind:this={refreshTable}/> -->
    <LookbookTable />

<div class="flex justify-end">
    <Button class="text-end"
    on:click={goBack}>Go Back</Button>
</div>
</div>




