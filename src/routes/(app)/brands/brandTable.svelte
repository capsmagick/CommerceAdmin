<script lang="ts">
  import CaretSort from "svelte-radix/CaretSort.svelte";
  import ChevronDown from "svelte-radix/ChevronDown.svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import API from "$lib/services/api";
  import { MoreHorizontal } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import CreditBrand from "./createBrand/+page.svelte";
  import Pagination from "$lib/components/ui/table-pagination/pagination.svelte";
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  export let showForm: boolean = false;
  // variables to handle pagination and table details
  let page: number = 1;
  let totalItems: number;
  let per_page: number = 10;
  let tableData: any[] = [];
  let sortData: boolean = true;
  let sortField: string = "";
  let searchData: string = "";

  let showDeleteModal = false;
  let deletingBrand: any;

  let editData: any;
  let editForm: boolean = false;

  let hidableCoulumns: any[] = [
    { name: "Logo", value: true },
    { name: "Description", value: true },
    { name: "Created At", value: false },
    { name: "Updated At", value: false },
    { name: "Created By", value: false },
    { name: "Updated By", value: false },
  ];

  async function getBrands() {
    try {
      let res = await API.get(
        `/masterdata/brand/?page=${page}&per_page=${per_page}&ordering=${sortField}&search=${searchData}`
      );
      totalItems = res.data.total;
      tableData = res.data.results;
    } catch (error) {
      console.error("fetch:brands:", error);
      return [];
    }
  }

  async function getNextPage() {
    page += 1;
    await getBrands();
  }

  async function getPage(event: any) {
    page = event.detail;
    await getBrands();
  }

  async function getPreviousPage() {
    page -= 1;
    await getBrands();
  }

  function onEdit(data: any) {
    editData = data;
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
    };
  }

  function confirmDelete() {
    API.delete(`/masterdata/brand/${deletingBrand.id}/delete_record/`)
      .then(() => {
        closeDeleteModal();
        getBrands();
        toast("Brand Deleted Successfully!");
      })
      .catch((error) => {
        console.error("Error deleting Brand:", error);
        closeDeleteModal();
      });
  }

  function closeDeleteModal() {
    showDeleteModal = false;
  }

  function cancelEditModel() {
    editData = null;
    editForm = false;
    showForm = false;
    dispatch("cancel");
  }

  onMount(() => {
    getBrands();
  });

  function sortName() {
    if (sortData) {
      sortField = "name";
      getBrands();
      sortData = !sortData;
    } else {
      sortField = "-name";
      getBrands();
      sortData = !sortData;
    }
  }

  function searchName(event: any) {
    searchData = event.target.value;
    getBrands();
  }

  function pageLimit(event: any, value: any) {
    per_page = value;
    getBrands();
  }
</script>

<div>
  {#if showDeleteModal}
    <ConfirmDeleteModal
      attribute={deletingBrand.name}
      on:confirm={confirmDelete}
      on:cancel={closeDeleteModal}
    />
  {/if}
</div>

<div class="abc">
  {#if showForm}
    <CreditBrand
      {editData}
      {editForm}
      on:cancel={cancelEditModel}
      on:newBrand={() => handleNewBrand()}
    />
  {/if}
</div>

<div class="w-full p-5">
  <div class="my-2 flex justify-between">
    <div>
      <Input
        class="max-w-sm"
        placeholder="Search Brands..."
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
        {#if hidableCoulumns[0].value}
          <Table.Head>Logo</Table.Head>
        {/if}
        <Table.Head
          >Name
          <Button on:click={() => sortName()} variant="ghost"
            ><CaretSort class="w-4 h-4" /></Button
          >
        </Table.Head>
        {#if hidableCoulumns[1].value}
          <Table.Head>Description</Table.Head>
        {/if}
        {#if hidableCoulumns[2].value}
          <Table.Head>Created At</Table.Head>
        {/if}
        {#if hidableCoulumns[3].value}
          <Table.Head>Updated At</Table.Head>
        {/if}
        {#if hidableCoulumns[4].value}
          <Table.Head>Created By</Table.Head>
        {/if}
        {#if hidableCoulumns[5].value}
          <Table.Head>Updated By</Table.Head>
        {/if}
        <Table.Head>Action</Table.Head>
      </Table.Row>
    </Table.Header>
    {#each tableData as data}
      <Table.Row>
        {#if hidableCoulumns[0].value}
          <Table.Cell>
            <img
              src={data.logo}
              alt="Logo"
              class="w-12 h-12 object-cover rounded-full"
            /></Table.Cell
          >
        {/if}
        <Table.Cell>{data.name}</Table.Cell>
        {#if hidableCoulumns[1].value}
          <Table.Cell>{data.description}</Table.Cell>
        {/if}
        {#if hidableCoulumns[2].value}
          <Table.Cell>{data.created_at}</Table.Cell>
        {/if}
        {#if hidableCoulumns[3].value}
          <Table.Cell>{data.updated_at}</Table.Cell>
        {/if}
        {#if hidableCoulumns[4].value}
          <Table.Cell>{data.created_by}</Table.Cell>
        {/if}
        {#if hidableCoulumns[5].value}
          <Table.Cell>{data.updated_by}</Table.Cell>
        {/if}
        <Table.Cell>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button builders={[builder]} variant="ghost"
                ><MoreHorizontal class="h-4 w-4" /></Button
              >
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="absolute">
              <DropdownMenu.Item on:click={() => onEdit(data)}
                ><i class="fa fa-pencil sm mr-2"></i>Edit</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={() => onDelete(data.id, data.name)}
                ><i class="fa fa-trash sm mr-2" style="color:red"
                ></i>Delete</DropdownMenu.Item
              >
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
