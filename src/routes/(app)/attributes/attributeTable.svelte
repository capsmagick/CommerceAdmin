<script lang="ts">
  import CaretSort from "svelte-radix/CaretSort.svelte";
  import ChevronDown from "svelte-radix/ChevronDown.svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { onMount } from "svelte";
  import API from "$lib/services/api";
  import { MoreHorizontal } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import Pagination from "$lib/components/ui/table-pagination/pagination.svelte";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import CreditAttribute from "./createattributes/+page.svelte";

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
  let deletingAttribute: any;

  let editData: any;
  let editForm: boolean = false;

  async function getAttribute() {
    try {
      let res = await API.get(
        `/masterdata/attribute/?page=${page}&per_page=${per_page}&ordering=${sortField}&search=${searchData}`
      );

      totalItems = res.data.total;
      tableData = res.data.results;
    } catch (error) {
      console.error("fetch:Attribute:", error);
      return [];
    }
  }

  async function getNextPage() {
    page += 1;
    await getAttribute();
  }

  async function getPage(event: any) {
    page = event.detail;
    await getAttribute();
  }

  async function getPreviousPage() {
    page -= 1;
    await getAttribute();
  }

  function onEdit(data: any) {
    editData = data;
    showForm = true;
    editForm = true;
  }

  function handleNewAttribute() {
    editData = null;
    editForm = false;
    showForm = false;
    getAttribute();
  }

  function onDelete(id: any, name: any) {
    showDeleteModal = true;
    deletingAttribute = {
      id: id,
      name: name,
    };
  }

  function confirmDelete() {
    API.delete(`/masterdata/attribute/${deletingAttribute.id}/delete_record/`)
      .then(() => {
        closeDeleteModal();
        getAttribute();
        toast("Attribute Deleted Successfully!");
      })
      .catch((error) => {
        console.error("Error deleting Attribute:", error);
        closeDeleteModal();
      });
  }

  function closeDeleteModal() {
    showDeleteModal = false;
  }

  onMount(() => {
    getAttribute();
  });

  function sortName() {
    if (sortData) {
      sortField = "name";
      getAttribute();
      sortData = !sortData;
    } else {
      sortField = "-name";
      getAttribute();
      sortData = !sortData;
    }
  }

  function searchName(event: any) {
    searchData = event.target.value;
    getAttribute();
  }

  function pageLimit(event: any, value: any) {
    per_page = value;
    getAttribute();
  }
</script>

<div>
  {#if showDeleteModal}
    <ConfirmDeleteModal
      attribute={deletingAttribute.name}
      on:confirm={confirmDelete}
      on:cancel={closeDeleteModal}
    />
  {/if}
</div>

<div class="abc">
  {#if showForm}
    <CreditAttribute
      {editData}
      {editForm}
      on:cancel={() => {
        editData = null;
        editForm = false;
        showForm = false;
      }}
      on:newAttribute={() => handleNewAttribute()}
    />
  {/if}
</div>

<div class="w-full p-5">
  <div class="my-2 flex justify-between">
    <div>
      <Input
        class="max-w-sm"
        placeholder="Search Attribute..."
        type="text"
        on:input={(event) => searchName(event)}
      />
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
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head
          >Name
          <Button on:click={() => sortName()} variant="ghost"
            ><CaretSort class="w-4 h-4" /></Button
          >
        </Table.Head>
        <Table.Head>Value</Table.Head>
        <Table.Head>Actions</Table.Head>
      </Table.Row>
    </Table.Header>
    {#each tableData as data}
      <Table.Row>
        <Table.Cell>{data.name}</Table.Cell>
        <Table.Cell>{data.value}</Table.Cell>
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
