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
  import AddToLookbook from './addToLookbook/+page.svelte'
  import ViewProduct from './viewProduct/+page.svelte'


    let showDeleteModal = false;
    let deletingProduct: any;
    let refreshTable: any;
    let showVariantForm: boolean = false;
    let showForm: boolean = false;
    let editForm: boolean = false;
    let editData:any;
    let showModal = false;
    let viewProduct = false
    let lookbookModalForm: boolean = false

    function toggleForm() {
      showForm = !showForm
    }

      // View Product
    async function onViewProduct(eventData:any) {
        editData = eventData.original.id;
        // console.log(editData);
        viewProduct = true;
        editForm = true;                
    }
    // Edit Attribute
    async function onEditProduct(eventData:any) {
        editData = eventData.original;
        console.log(editData);
        showModal = true;
        editForm = true;                
    }
    async function onChangeStatus(eventData: any) {
      let status = eventData.original.is_disabled;
      let url = !status ? `/products/product/${eventData.original.id}/enable/` : `/products/product/${eventData.original.id}/disable/`;
      
      API.post(url).then(()=>{
        toast.success("Product status updated successfully");
        refreshTable.refreshTable();
      }).catch((error:any)=>{
        console.log(error)
      })
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

        async function addLookbook(eventData: any) {
        productIdStore.set(eventData.original.id);
        // goto(`lookbook/createLookbook`)
        lookbookModalForm = true
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
    {#if lookbookModalForm}
        <AddToLookbook {editData}
                {editForm} on:newLookbook={()=>{lookbookModalForm = false}}
                            on:cancel={()=>{lookbookModalForm = false}}
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
                     on:view={(event) => onViewProduct(event.detail.item.row)}
                     on:edit={(event) => onEditProduct(event.detail.item.row)}
                     on:delete={(event) => onDeleteProduct(event.detail.item.row)}
                     on:addVariant={(event) => onCreateVariant(event.detail.item.row)}
                     on:viewVariant={(event) => viewVariantTable(event.detail.item.row)}
                     on:addLookbook={(event) => addLookbook(event.detail.item.row)}
                     on:status={(event) => onChangeStatus(event.detail.item.row)}
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

    <div>
    {#if viewProduct}
    <ViewProduct 
      {editData}
      on:cancel = {() => (editData = null, viewProduct = false) }
    />
    {/if}
  </div>
 
  