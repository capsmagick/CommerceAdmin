<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import LookbookTable from "./lookbookTable.svelte";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import CreateLookbook from "./createLookbook/+page.svelte";
  import API from "$lib/services/api";
  import {toast} from "svelte-sonner";


    let showDeleteModal = false;
    let deletingLookbook: any;
    let refreshTable;
    let editData;
    let showForm: boolean = false;
    let editForm: boolean = false;

    function toggleForm() {
    console.log(showForm)
    showForm = !showForm
    }

    function handleNewLookbook() {
    editData = null;
    editForm = false;
    showForm = false;
    refreshTable.refreshTable();
    }

        // Edit Attribute
    async function onEditLookbook(eventData) {
        editData = eventData.original;
        showForm = true;
        editForm = true;
    }

    async function onDeleteLookbook(eventData) {
        deletingLookbook = eventData.original;
        showDeleteModal = true;
    }

        function confirmDelete() {
        API.delete(`/products/look-book/${deletingLookbook.id}/delete_record/`).then(() => {
            closeDeleteModal();
        }).catch((error) => {
            console.error("Error deleting Lookbook:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshTable.refreshTable();
        toast("Lookbook Deleted Successfully!");
    }

</script>
<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingLookbook.name} on:confirm={confirmDelete}
          on:cancel={closeDeleteModal}/>
    {/if}
</div>
<div class="abc">
    {#if showForm}
      <CreateLookbook
      {editData}
      {editForm}
      on:close={() => {editData = null;editForm = false;showForm = false;}}
      on:newLookbook={() => handleNewLookbook()}/>
    {/if}
</div>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center ">
      <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Lookboook</h4>
      <div class="glow-border mr-4">
        <Button variant="outline" class="glow-border-content">Export</Button>
      </div>
      <div class="glow-border mr-4">
        <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={() => toggleForm()}>
        <i class="fa-solid fa-cloud-arrow-up text-sm"></i>
        Add Lookbook</Button>
        </div>
  </div>
  <LookbookTable on:newLookBook={() => toggleForm()}
                on:edit={(event) => onEditLookbook(event.detail.item.row)}
                on:delete={(event) => onDeleteLookbook(event.detail.item.row)}
                bind:this={refreshTable}/>
</div>



