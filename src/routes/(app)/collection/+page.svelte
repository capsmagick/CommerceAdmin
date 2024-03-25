<script lang="ts">
 import { onMount } from "svelte";
import { goto } from '$app/navigation';
import API from "$lib/services/api";
import { Button } from "$lib/components/ui/button";
import CollectionTable from "./collectionTable.svelte";
import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
import CreateCollection from "./createCollection/+page.svelte";
import {toast} from "svelte-sonner";

 let showDeleteModal = false;
    let deletingCollection: any;
    let refreshTable;
    let editData;
    let showForm: boolean = false;
    let editForm: boolean = false;

    function toggleForm() {
        console.log(showForm)
        showForm = !showForm
    }

    // Edit Attribute
    async function onEditCollection(eventData) {
        editData = eventData.original;
        showForm = true;
        editForm = true;
    }

    async function onDeleteCollection(eventData) {
        deletingCollection = eventData.original;
        showDeleteModal = true;
    }

    function confirmDelete() {
        API.delete(`/products/collection/${deletingCollection.id}/delete_record/`).then(() => {
            closeDeleteModal();
            toast("Collection Deleted Successfully!");
        }).catch((error) => {
            console.error("Error deleting Collection:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshTable.refreshTable();
    }

    function handleNewCollection() {
        editData = null;
        editForm = false;
        showForm = false;
        refreshTable.refreshTable();
    }

</script>
<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingCollection.name} on:confirm={confirmDelete}
                            on:cancel={closeDeleteModal}/>
    {/if}
</div>

<div class="abc">
    {#if showForm}
        <CreateCollection
                {editData}
                {editForm}
                on:cancel={() => {editData = null;editForm = false;showForm = false;}}
                on:newCollection={() => handleNewCollection()}/>
    {/if}
</div>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border" style="height: calc(100vh - 80px);">
  <div class="flex items-center justify-between">
      <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Collection</h4>
      <div class="glow-border mr-4">
        <Button variant="outline" class="text-xs flex items-center gap-2  px-4 py-1.5">Export Collection</Button>
      </div>
      <div class="glow-border mr-4">
        <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={() => toggleForm()}>
        <i class="fa-solid  fa-cloud-arrow-up text-sm"></i>
        Add Collection</Button>
      </div>
  </div>
  <CollectionTable on:newCollection={() => toggleForm()}
                on:edit={(event) => onEditCollection(event.detail.item.row)}
                on:delete={(event) => onDeleteCollection(event.detail.item.row)}
                bind:this={refreshTable}/>
</div>

