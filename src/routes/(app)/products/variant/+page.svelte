<script lang="ts">
  /** @type {import('./$types').PageData} */
  import { onMount } from "svelte";
  import { goto } from "$app/navigation"
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import {toast} from "svelte-sonner";
  import VariantTable from "./variantTable.svelte";
  import CreateVariant from "./createVariant/+page.svelte"
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";


  let showDeleteModal = false;
  let showModal: boolean = false
  let editData: any;
  let editForm: boolean;
  let deletingVariant: any;
  let refreshTable: any;

  async function closemodal() {
    showModal = false
    editForm = false
    editData = null
  }
    async function onEditProduct(eventData:any) {
      editData = eventData.original;
      showModal = true;
      editForm = true;
      // console.log(productDetails);
                
    }

    async function onDeleteProduct(eventData: any) {
        deletingVariant = eventData.original;
        showDeleteModal = true;
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshTable.refreshTable();
    }

    function confirmDelete() {
      API.delete(`/products/variant/${deletingVariant.id}/delete_record/`).then(() => {
          closeDeleteModal();
          toast("Product Deleted Successfully!");
      }).catch((error) => {
          console.error("Error deleting Product:", error);
          closeDeleteModal();
      });
  }

  function goBack() {
    goto("/products");
  }

</script>
<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingVariant.name} on:confirm={confirmDelete}
                            on:cancel={closeDeleteModal}
                            />
    {/if}
</div>
<div>
  {#if showModal}
    <CreateVariant 
        {editData}
        {editForm}
        on:close = {() => closemodal()}
        on:newVariant={() => {
                        closemodal();
                        refreshTable.refreshTable();
                        }}/>
  {/if}
</div>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center ">
      <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Variant</h4>
      <div class="glow-border mr-4">
      <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={() => (showModal = true)}>
        <i class="fa-solid  fa-cloud-arrow-up text-sm"></i>
        Add Variant</Button>
      </div>
  </div>
  <VariantTable 
    on:edit={(event) => onEditProduct(event.detail.item.row)}
    on:delete={(event) => onDeleteProduct(event.detail.item.row)}
    bind:this={refreshTable}/>
  <div class="flex justify-end">
    <Button class="text-end"
    on:click={goBack}>Go Back</Button>
  </div>
</div>