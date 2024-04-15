<script lang="ts">
  import CaretSort from "svelte-radix/CaretSort.svelte";
  import ChevronDown from "svelte-radix/ChevronDown.svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import API from "$lib/services/api";
  import { onMount } from "svelte";
  import { MoreHorizontal } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import Pagination from "$lib/components/ui/table-pagination/pagination.svelte";
  import CreateTax from "./createTax/+page.svelte";


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
  let deletingTax: any;

  let editData: any;
  let editForm: boolean = false;

  let hidableCoulumns: any[] = [{ name: "slab", value: true }];

  async function getTax() {
    try {
      let res = await API.get(
        `/inventory/tax/?page=${page}&per_page=${per_page}&ordering=${sortField}&search=${searchData}`
      );
      totalItems = res.data.total;
      tableData = res.data.results;
    } catch (error) {
      console.error("fetch:Tax:", error);
      return [];
    }
  }

  async function getNextPage() {
    page += 1;
    await getTax();
  }

  async function getPage(event: any) {
    page = event.detail;
    await getTax();
  }

  async function getPreviousPage() {
    page -= 1;
    await getTax();
  }

  function onEdit(data: any) {
    editData = data;
    showForm = true;
    editForm = true;
  }

  function handleNewTax() {
    editData = null;
    editForm = false;
    showForm = false;
    getTax();
  }

  function onDelete(id: any, name: any) {
    showDeleteModal = true;
    deletingTax = {
      id: id,
      name: name,
    };
  }

  function confirmDelete() {
    API.delete(`/inventory/tax/${deletingTax.id}/delete_record/`)
      .then(() => {
        closeDeleteModal();
        getTax();
        toast("Tax Deleted Successfully!");
      })
      .catch((error) => {
        console.error("Error deleting Tax:", error);
        closeDeleteModal();
      });
  }

  function closeDeleteModal() {
    showDeleteModal = false;
  }

  onMount(() => {
    getTax();
  });

  function sortName() {
    if (sortData) {
      sortField = "name";
      getTax();
      sortData = !sortData;
    } else {
      sortField = "-name";
      getTax();
      sortData = !sortData;
    }
  }

  function searchName(event: any) {
    searchData = event.target.value;
    getTax();
  }

  function pageLimit(event: any, value: any) {
    per_page = value;
    getTax();
  }
</script>

<div>
  {#if showDeleteModal}
    <ConfirmDeleteModal
      attribute={deletingTax.name}
      on:confirm={confirmDelete}
      on:cancel={closeDeleteModal}
    />
  {/if}
</div>

<div class="abc">
  {#if showForm}
    <CreateTax
      {editData}
      {editForm}
      on:cancel={() => {
        editData = null;
        editForm = false;
        showForm = false;
      }}
      on:newTax={() => handleNewTax()}
    />
  {/if}
</div>

<div class="w-full p-5">
  <div class="my-2 flex justify-between">
    <div>
      <Input
        class="max-w-sm"
        placeholder="Search Tax..."
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
        <Table.Head
          >Name
          <Button on:click={() => sortName()} variant="ghost"
            ><CaretSort class="w-4 h-4" /></Button
          >
        </Table.Head>
        {#if hidableCoulumns[0].value}
          <Table.Head>Slab</Table.Head>
        {/if}
        <Table.Head>Action</Table.Head>
      </Table.Row>
    </Table.Header>
    {#each tableData as data}
      <Table.Row>
        <Table.Cell>{data.name}</Table.Cell>
        {#if hidableCoulumns[0].value}
          <Table.Cell>{data.slab}</Table.Cell>
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
