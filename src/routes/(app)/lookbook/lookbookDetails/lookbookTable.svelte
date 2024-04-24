<script lang="ts">
    import CaretSort from "svelte-radix/CaretSort.svelte";
    import ChevronDown from "svelte-radix/ChevronDown.svelte";
    import * as Table from "$lib/components/ui/table/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import API from "$lib/services/api";
    import { createEventDispatcher, onMount } from "svelte";
    import { MoreHorizontal } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
    import Pagination from "$lib/components/ui/table-pagination/pagination.svelte";
    import CreateLookBook from "../createLookbook/+page.svelte";
  
    let dispatch = createEventDispatcher();
  
    export let showForm: boolean = false;
    // lookbook to handle pagination and table details
    let page: number = 1;
    let totalItems: number;
    let per_page: number = 10;
    let tableData: any[] = [];
    let sortData: boolean = true;
    let sortField: string = "";
    let searchData: string = "";
  
    let showDeleteModal = false;
    let deletingLookbook: any;
  
    let editData: any;
    let editForm: boolean = false;
  
    //url params
    let lookbookId: any;
  
      const urlParams = new URLSearchParams(window.location.search);
      lookbookId = urlParams.get('product');
      console.log("Product ID from URL:", lookbookId);
  
      if (lookbookId) {
        sessionStorage.setItem('lookbookId', lookbookId);
      } else {
        lookbookId = sessionStorage.getItem('lookbookId');
      }
     //url params close
  
    let hidableCoulumns: any[] = [
      { name: "Selling Price", value: true },
      { name: "Stock", value: true },
    ];
  
    async function getVariant() {
      try {
        let res = await API.get(
          `/products/look-book/${lookbookId}&page=${page}&per_page=${per_page}&ordering=${sortField}&search=${searchData}`
        );
        totalItems = res.data.total;
        tableData = res.data.results;
      } catch (error) {
        console.error("fetch:category:", error);
        return [];
      }
    }
  
    async function getNextPage() {
      page += 1;
      await getVariant();
    }
  
    async function getPage(event: any) {
      page = event.detail;
      await getVariant();
    }
  
    async function getPreviousPage() {
      page -= 1;
      await getVariant();
    }
  
    function onEdit(data: any) {
      console.log("Edit:", data);
      editData = data;
      showForm = true;
      editForm = true;
    }
  
    function handleNewVariant() {
      editData = null;
      editForm = false;
      showForm = false;
      getVariant();
    }
  
    function onDelete(id: any) {
      showDeleteModal = true;
      deletingLookbook = {
        id: id,
      //   name: name,
      };
    }
  
    function confirmDelete() {
      API.delete(`/products/look-book/${deletingLookbook.id}/delete_record/`)
        .then(() => {
          closeDeleteModal();
          getVariant();
          toast("Variant Deleted Successfully!");
        })
        .catch((error) => {
          console.error("Error deleting Variant:", error);
          closeDeleteModal();
        });
    }
  
    function closeDeleteModal() {
      showDeleteModal = false;
    }
  
    function colseVariant(){
        editData = null;
        editForm = false;
        showForm = false;
        dispatch ("cancel");
      }
  
    onMount(() => {
      getVariant();
    });
  
    function sortName() {
      if (sortData) {
        sortField = "name";
        getVariant();
        sortData = !sortData;
      } else {
        sortField = "-name";
        getVariant();
        sortData = !sortData;
      }
    }
  
    function searchName(event: any) {
      searchData = event.target.value;
      getVariant();
    }
  
    function pageLimit(event: any, value: any) {
      per_page = value;
      getVariant();
    }
  </script>
  
  <div>
    {#if showDeleteModal}
      <ConfirmDeleteModal
        attribute={deletingLookbook.name}
        on:confirm={confirmDelete}
        on:cancel={closeDeleteModal}
      />
    {/if}
  </div>
  
  <div class="abc">
    {#if showForm}
      <CreateLookBook
        {editData}
        {editForm}
        on:cancel={colseVariant}
        on:newVariant={() => handleNewVariant()}
      />
    {/if}
  </div>
  
  <div class="w-full p-5">
    <div class="my-2 flex justify-between">
      <div>
        <Input
          class="max-w-sm"
          placeholder="Search Categories..."
          type="text"
          on:input={(event) => searchName(event)}
        />
      </div>
      <div class="flex">
        <div class="mr-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="outline" size="sm">
                Column
                <ChevronDown class="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {#each hidableCoulumns as column}
                <DropdownMenu.CheckboxItem bind:checked={column.value}
                  >{column.name}</DropdownMenu.CheckboxItem
                >
              {/each}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        <div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="outline" size="sm">
                {per_page}
                <ChevronDown class="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item on:click={(event) => pageLimit(event, 10)}
                >10</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={(event) => pageLimit(event, 20)}
                >20</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={(event) => pageLimit(event, 25)}
                >25</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={(event) => pageLimit(event, 50)}
                >50</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={(event) => pageLimit(event, 100)}
                >100</DropdownMenu.Item
              >
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </div>
  
    <Table.Root>
      <Table.Header>
        <Table.Row>
            <Table.Head>
              Product Name
              <Button on:click={() => sortName()} variant="ghost">
                <CaretSort class="w-4 h-4" /></Button>
            </Table.Head>
          {#if hidableCoulumns[0].value}
            <Table.Head>Selling Price</Table.Head>
          {/if}
          {#if hidableCoulumns[1].value}
            <Table.Head>Stock</Table.Head>
          {/if}
          <Table.Head>Action</Table.Head>
        </Table.Row>
      </Table.Header>
      {#each tableData as data}
        <Table.Row>
            <Table.Cell>{data.product.name}</Table.Cell>
          {#if hidableCoulumns[0].value}
            <Table.Cell>{data.selling_price}</Table.Cell>
          {/if}
          {#if hidableCoulumns[1].value}
            <Table.Cell>{data.stock}</Table.Cell>
          {/if}
          <Table.Cell>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild let:builder>
                <Button builders={[builder]} variant="ghost"
                  ><MoreHorizontal class="h-4 w-4" /></Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content class="absolute">
                <DropdownMenu.Item on:click={() => onEdit(data)}>
                  <i class="fa fa-pencil sm mr-2"></i>Edit</DropdownMenu.Item>
                <DropdownMenu.Item on:click={() => onDelete(data.id)}>
                  <i class="fa fa-trash sm mr-2" style="color:red"></i>Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Root>
  
    <div class="d-flex justify-end align-items-end mt-3">
      <Pagination
        {totalItems}
        {per_page}
        on:prev={getPreviousPage}
        on:next={getNextPage}
        on:page={(event) => getPage(event)}
      />
    </div>
  </div>