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
  import Pagination from "$lib/components/ui/table-pagination/pagination.svelte";

  let page: number = 1;
  let totalItems: number;
  let per_page: number = 10;
  let tableData: any[] = [];
  let sortData: boolean = true;
  let sortField: string = "";
  let searchData: string = "";

  let hidableCoulumns: any[] = [
    { name: "Prifile Picture", value: true },
    { name: "User Name", value: true },
    { name: "E mail", value: true },
    { name: "Gender", value: false },
    { name: "Mobile Number", value: true },
  ];

  async function getCustomers() {
    try {
      let res = await API.get(
        `/account/customers/?page=${page}&per_page=${per_page}&ordering=${sortField}&search=${searchData}`
      );
      totalItems = res.data.total;
      tableData = res.data.results;
      console.log(tableData);
    } catch (error) {
      console.error("fetch:customers:", error);
      return [];
    }
  }

  async function getNextPage() {
    page += 1;
    await getCustomers();
  }

  async function getPage(event: any) {
    page = event.detail;
    await getCustomers();
  }

  async function getPreviousPage() {
    page -= 1;
    await getCustomers();
  }

  onMount(() => {
    getCustomers();
  });

  function sortName() {
    if (sortData) {
      sortField = "first_name";
      getCustomers();
      sortData = !sortData;
    } else {
      sortField = "-first_name";
      getCustomers();
      sortData = !sortData;
    }
  }

  function searchName(event: any) {
    searchData = event.target.value;
    getCustomers();
  }

  function pageLimit(event: any, value: any) {
    per_page = value;
    getCustomers();
  }
</script>

<div class="w-full p-5">
  <div class="my-2 flex justify-between">
    <div>
      <Input
        class="max-w-sm"
        placeholder="Search Customers..."
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
          <Table.Head>Image</Table.Head>
        {/if}
        <Table.Head
          >Name
          <Button on:click={() => sortName()} variant="ghost"
            ><CaretSort class="w-4 h-4" /></Button
          >
        </Table.Head>
        {#if hidableCoulumns[1].value}
          <Table.Head>User Name</Table.Head>
        {/if}
        {#if hidableCoulumns[2].value}
          <Table.Head>E Mail</Table.Head>
        {/if}
        {#if hidableCoulumns[3].value}
          <Table.Head>Gender</Table.Head>
        {/if}
        {#if hidableCoulumns[4].value}
          <Table.Head>Mobile Number</Table.Head>
        {/if}
        <Table.Head>Action</Table.Head>
      </Table.Row>
    </Table.Header>
    {#each tableData as data}
      <Table.Row>
        {#if hidableCoulumns[0].value}
          <Table.Cell>
            <img
              src={data.profile_picture}
              alt="profile_picture"
              class="w-12 h-12 object-cover rounded-full"
            /></Table.Cell
          >
        {/if}
        <Table.Cell>{data.first_name} {data.last_name}</Table.Cell>
        {#if hidableCoulumns[1].value}
          <Table.Cell>{data.username}</Table.Cell>
        {/if}
        {#if hidableCoulumns[2].value}
          <Table.Cell>{data.email}</Table.Cell>
        {/if}
        {#if hidableCoulumns[3].value}
          <Table.Cell>{data.gender}</Table.Cell>
        {/if}
        {#if hidableCoulumns[4].value}
          <Table.Cell>{data.mobile_number}</Table.Cell>
        {/if}
        <Table.Cell>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button builders={[builder]} variant="ghost"
                ><MoreHorizontal class="h-4 w-4" /></Button
              >
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="absolute">
              <DropdownMenu.Item
                ><i class="fa fa-pencil sm mr-2"></i>Edit</DropdownMenu.Item
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
