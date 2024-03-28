<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import ProductTable from "./productTable.svelte";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import CreateVariant from "./variant/createVariant/+page.svelte";
  import ProductModal from "./createProduct/+page.svelte"
  import {toast} from "svelte-sonner";
  import { productIdStore } from '../../../lib/stores/data';


    let showDeleteModal = false;
    let deletingProduct: any;
    let refreshTable: any;
    let showVariantForm: boolean = false;
    let showForm: boolean = false;
    let editForm: boolean = false;
    let editData:any;
    let showModal = false;

    function toggleForm() {
        console.log(showForm)
        showForm = !showForm
    }

    // Edit Attribute
    async function onEditProduct(eventData:any) {
        editData = eventData.original;
        showModal = true;
        editForm = true;
        // console.log(productDetails);
                
    }

    async function onDeleteProduct(eventData: any) {
        deletingProduct = eventData.original;
        showDeleteModal = true;
    }

    // add variant
    async function onCreateVariant(eventData: any) {
        editData = eventData.original;
        showVariantForm = true;
    }

    function closeVariantmodal() {
      showVariantForm = false;
      editData = null
      editForm = false
    }

    function addVariantData() {
      showVariantForm = false;
      editData = null
    }

    async function viewVariantTable(eventData: any) {
        productIdStore.set(eventData.original.id);
        goto(`products/variant/`)
    }



    function confirmDelete() {
        API.delete(`/products/product/${deletingProduct.id}/delete_record/`).then(() => {
            closeDeleteModal();
            toast("Product Deleted Successfully!");
        }).catch((error) => {
            console.error("Error deleting Product:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshTable.refreshTable();
    }
    


  let products:any[] = [];

  
  async function fetchProducts(){
    try {
      const res = await API.get("/products/product/")
      products = res.data.results || [];
    } catch (error) {
      console.log("fetch:products:", error)
    }
  }

  // Mount
  onMount(async() => {
    await fetchProducts()

   
  })
 
  async function closemodal() {
    showModal = false
    editForm = false
    editData = null
  }

</script>

<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingProduct.name} on:confirm={confirmDelete}
                            on:cancel={closeDeleteModal}
                            />
    {/if}
</div>

<div>
    {#if showVariantForm}
        <CreateVariant 
                {editData}
                {editForm}
                on:close={() => closeVariantmodal()}
                on:newVariant={() => addVariantData()}
                />
    {/if}
</div>

<div class="m-3  shadow-md glow-border">
  <div class=" bg-background text-foreground p-4 px-6 glow-border-content">
  <div class="flex items-center ">
      <h2 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Products</h2>
      <div class="glow-border mr-4">
        <Button variant="outline" class="glow-border-content">Export Products</Button>
      </div>
      <div class="glow-border mr-4">
      <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={() => (showModal = true)}>
        <i class="fa-solid  fa-cloud-arrow-up text-sm"></i>
        Add Products</Button>
      </div>
  </div>
  <ProductTable on:newCategory={() => toggleForm()}
                     on:edit={(event) => onEditProduct(event.detail.item.row)}
                     on:delete={(event) => onDeleteProduct(event.detail.item.row)}
                     on:addVariant={(event) => onCreateVariant(event.detail.item.row)}
                     on:viewVariant={(event) => viewVariantTable(event.detail.item.row)}
                     bind:this={refreshTable}/>
  </div>
  </div>
  <div>
    {#if showModal}
    <ProductModal 
      {editData}
      {editForm}
      on:cancel = {() => closemodal()}
      on:newProduct={() => {
                            closemodal();
                            refreshTable.refreshTable();
                            showModal = false;
      }}
    />
    {/if}
  </div>
 
  