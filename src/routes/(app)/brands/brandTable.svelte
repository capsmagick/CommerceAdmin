<script lang="ts">
  import CaretSort from "svelte-radix/CaretSort.svelte";
  import ChevronDown from "svelte-radix/ChevronDown.svelte";
  import {
    createTable,
    Subscribe,
    Render,
    createRender,
  } from "svelte-headless-table";
  import {
    addSortBy,
    addPagination,
    addTableFilter,
    addSelectedRows,
    addHiddenColumns,
  } from "svelte-headless-table/plugins";
  import { writable } from "svelte/store";
  import * as Table from "$lib/components/ui/table/index.js";

  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { cn } from "$lib/utils.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { onMount } from "svelte";
  import API from "$lib/services/api";
  import {MoreHorizontal} from "lucide-svelte";
  import {toast} from "svelte-sonner";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import CreditBrand from "./createBrand/+page.svelte";
  import Pagination from "./pagination.svelte"



  // type Brand = {
  //   id: string;
  //   name: string;
  //   logo: string;
  //   description: string;
  //   created_at: string;
  //   updated_at: string;
  //   created_by: string;
  //   updated_by: string;
  //   tags: string[];
  // };
  export let showForm: boolean = false;
  let total_pages: number;
  let page: number = 1;
  let tableData: any[] = [];
  let showDeleteModal = false;
  let deletingBrand: any;
  let editData: any;  
  let editForm: boolean = false;
  let sortData: boolean = true;

    async function getBrands() {
    try {
      let res = await API.get(`/masterdata/brand/?page=${page}`);
      total_pages = res.data.total_pages;
      tableData = res.data.results;    
      console.log(tableData);
      console.log(res.data);
      
    } catch (error) {
      console.error("fetch:brands:", error);
      return [];
    }
  }

  async function getNextPage() {
    page += 1
    await getBrands();
  }

  async function getPreviousPage() {
    page -= 1
    await getBrands();
  }

      function onEdit(data: any) {
        editData = data
        showForm = true;
        editForm = true;
  }

      function handleNewBrand() {
        editData = null;
        editForm = false;
        showForm = false;
        getBrands();
    }

  function onDelete(id: any, name: any) {
    showDeleteModal = true;
    deletingBrand = {
        id: id,
        name: name,
      }
  }

    function confirmDelete() {
        API.delete(`/masterdata/brand/${deletingBrand.id}/delete_record/`).then(() => {
            closeDeleteModal();
            getBrands()
            toast("Brand Deleted Successfully!");
        }).catch((error) => {
            console.error("Error deleting Brand:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
    }

  onMount(() => {
    getBrands()
  });

  function sortName() {
    if (sortData) {
        tableData = tableData.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        tableData = tableData.sort((a, b) => b.name.localeCompare(a.name));
    }
    sortData = !sortData;
  }

</script>

<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingBrand.name} on:confirm={confirmDelete}
                            on:cancel={closeDeleteModal}/>
    {/if}
</div>

<div class="abc">
    {#if showForm}
        <CreditBrand
                {editData}
                {editForm}
                on:cancel={() => {editData = null;editForm = false;showForm = false;}}
                on:newBrand={() => handleNewBrand()}/>
    {/if}
</div>

<div class="p-5">
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head class="flex justify-between">Name
          <Button on:click={() => sortName()} variant="ghost"><CaretSort  class="w-4 h-4" /></Button>
        </Table.Head>
        <Table.Head>Logo</Table.Head>
        <Table.Head>Description</Table.Head>
        <Table.Head>Action</Table.Head>
      </Table.Row>
    </Table.Header>
      {#each tableData as data}
        <Table.Row>
          <Table.Cell>{data.name}</Table.Cell>
          <Table.Cell>  <img src={data.logo} alt="Logo" class="w-12 h-12 object-cover rounded-full"></Table.Cell>
          <Table.Cell>{data.description}</Table.Cell>  
          <Table.Cell>
             <DropdownMenu.Root>
               <DropdownMenu.Trigger asChild let:builder>
                <Button  builders={[builder]} variant='ghost'><MoreHorizontal class="h-4 w-4"/></Button>
              </DropdownMenu.Trigger>
                <DropdownMenu.Content class="absolute">
                  <DropdownMenu.Item  on:click={() =>onEdit(data)} ><i class="fa fa-pencil sm mr-2"></i>Edit</DropdownMenu.Item>
                  <DropdownMenu.Item on:click={() =>onDelete(data.id, data.name)} ><i class="fa fa-trash sm mr-2" style="color:red"></i>Delete</DropdownMenu.Item>
                </DropdownMenu.Content>
             </DropdownMenu.Root>
            
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Root>

    <div class="flex items-center justify-end space-x-2 py-4">
      <Button
      variant="outline"
      size="sm"
      on:click={getPreviousPage}
      disabled={page === 1}
      >Previous
      </Button>
      <Button variant="outline" size="sm" disabled={page == total_pages} on:click={getNextPage}
        >Next
      </Button>
    </div>
   <div>
    <Pagination total_pages={total_pages} page={page} />
   </div>
</div>