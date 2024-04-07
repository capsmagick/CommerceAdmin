<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import TaxTable from "./taxTable.svelte";
  import API from "$lib/services/api";
  import {toast} from "svelte-sonner";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import CreateTax from "./createTax/+page.svelte";




    let showDeleteModal = false;
    let deletingTax: any;
    let refreshTable: any;
    let editForm: boolean = false;
    let editData:any;
    let showModal = false;


    async function onEditTax(eventData:any) {
        editData = eventData.original;
        console.log(editData);
        showModal = true;
        editForm = true;                
    }
    
    function handleNewTax() {
    editData = null;
    editForm = false;
    showModal = false;
    refreshTable.refreshTable();
    }

    async function onDeleteTax(eventData: any) {
        deletingTax = eventData.original;
        showDeleteModal = true;
    }

     function confirmDelete() {
        API.delete(`/inventory/tax/${deletingTax.id}/delete_record/`).then(() => {
            closeDeleteModal();
            toast("Tax Deleted Successfully!");
        }).catch((error) => {
            console.error("Error deleting Tax:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshTable.refreshTable();
    }

    async function closemodal() {
    showModal = false
    editForm = false
    editData = null
  }

</script>
<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingTax.name} on:confirm={confirmDelete}
                            on:cancel={closeDeleteModal}
                            />
    {/if}
</div>

    {#if showModal}
      <CreateTax
      {editData}
      {editForm}
      on:cancel={() => {closemodal()}}
      on:newTax={() => handleNewTax()}/>
    {/if}
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center justify-between">
      <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Tax Configuration</h4>
      <div class="glow-border mr-4">
        <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5">Export Tax Configuration</Button>
      </div>
     <div class="glow-border mr-4">
      <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={() => (showModal = true)}>
        <i class="fa-solid  fa-cloud-arrow-up text-sm"></i>
        Add Tax</Button>
      </div>
  </div>
  <TaxTable 
          on:edit={(event) => onEditTax(event.detail.item.row)}
          on:delete={(event) => onDeleteTax(event.detail.item.row)}
          bind:this={refreshTable}/>
</div>