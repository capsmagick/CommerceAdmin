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

  // variables to handle pagination and table details
  let page: number = 1;
  let totalItems: number;
  let per_page: number = 10;
  let tableData: any[] = [];
  let sortData: boolean = true;
  let sortField: string = "";
  let searchData: string = "";

  let hidableCoulumns: any[] = [
    { name: "Email", value: false },
    { name: "Description", value: true },
    { name: "Order Status", value: true },
    { name: "Payment Status", value: false },
    { name: "Payment Method", value: false },
    { name: "Total Amount", value: true },
    { name: "Created At", value: false },
    { name: "Updated At", value: false },
    { name: "Created By", value: false },
    { name: "Updated By", value: false },
  ];

  async function getOrders() {
    try {
      let res = await API.get(
        `/orders/order/?page=${page}&per_page=${per_page}&ordering=${sortField}&search=${searchData}`
      );
      totalItems = res.data.total;
      tableData = res.data.results;
    } catch (error) {
      console.error("fetch:order:", error);
      return [];
    }
  }

  async function getNextPage() {
    page += 1;
    await getOrders();
  }

  async function getPage(event: any) {
    page = event.detail;
    await getOrders();
  }

  async function getPreviousPage() {
    page -= 1;
    await getOrders();
  }

  async function handleProcessing(id: any) {
    API.post(`orders/order/${id}/order-processing/`)
      .then(() => {
        toast.success("Order status updated successfully");
        getOrders();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function handlePacking(id: any) {
    API.post(`orders/order/${id}/packing/`)
      .then(() => {
        toast.success("Order status updated successfully");
        getOrders();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function handleReady(id: any) {
    API.post(`orders/order/${id}/ready-for-dispatch/`)
      .then(() => {
        toast.success("Order status updated successfully");
        getOrders();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function handleShipped(id: any) {
    API.post(`orders/order/${id}/shipped/`)
      .then(() => {
        toast.success("Order status updated successfully");
        getOrders();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function handleDelivered(id: any) {
    API.post(`orders/order/${id}/delivered/`)
      .then(() => {
        toast.success("Order status updated successfully");
        getOrders();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  onMount(() => {
    getOrders();
  });

  function sortName() {
    if (sortData) {
      sortField = "name";
      getOrders();
      sortData = !sortData;
    } else {
      sortField = "-name";
      getOrders();
      sortData = !sortData;
    }
  }

  function searchName(event: any) {
    searchData = event.target.value;
    getOrders();
  }

  function pageLimit(event: any, value: any) {
    per_page = value;
    getOrders();
  }
</script>

<div class="w-full p-5">
  <div class="my-2 flex justify-between">
    <div>
      <Input
        class="max-w-sm"
        placeholder="Search Orders..."
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
          <Table.Head>Email</Table.Head>
        {/if}
        {#if hidableCoulumns[1].value}
          <Table.Head>Description</Table.Head>
        {/if}
        {#if hidableCoulumns[2].value}
          <Table.Head>Order Status</Table.Head>
        {/if}
        {#if hidableCoulumns[3].value}
          <Table.Head>Payment Status</Table.Head>
        {/if}
        {#if hidableCoulumns[4].value}
          <Table.Head>Payment Method</Table.Head>
        {/if}
        {#if hidableCoulumns[5].value}
          <Table.Head>Total Amount</Table.Head>
        {/if}
        {#if hidableCoulumns[6].value}
          <Table.Head>Created At</Table.Head>
        {/if}
        {#if hidableCoulumns[7].value}
          <Table.Head>Updated At</Table.Head>
        {/if}
        {#if hidableCoulumns[8].value}
          <Table.Head>Created By</Table.Head>
        {/if}
        {#if hidableCoulumns[9].value}
          <Table.Head>Updated By</Table.Head>
        {/if}
        <Table.Head>Action</Table.Head>
      </Table.Row>
    </Table.Header>
    {#each tableData as data}
      <Table.Row>
        <Table.Cell>{data.user}</Table.Cell>
        {#if hidableCoulumns[0].value}
          <Table.Cell>{data.email}</Table.Cell>
        {/if}
        {#if hidableCoulumns[1].value}
          <Table.Cell>{data.description}</Table.Cell>
        {/if}
        {#if hidableCoulumns[2].value}
          <Table.Cell>{data.status}</Table.Cell>
        {/if}
        {#if hidableCoulumns[3].value}
          <Table.Cell>{data.paymentStatus}</Table.Cell>
        {/if}
        {#if hidableCoulumns[4].value}
          <Table.Cell>{data.paymentMethod}</Table.Cell>
        {/if}
        {#if hidableCoulumns[5].value}
          <Table.Cell>{data.total_amount}</Table.Cell>
        {/if}
        {#if hidableCoulumns[6].value}
          <Table.Cell>{data.created_at}</Table.Cell>
        {/if}
        {#if hidableCoulumns[7].value}
          <Table.Cell>{data.updated_at}</Table.Cell>
        {/if}
        {#if hidableCoulumns[8].value}
          <Table.Cell>{data.created_by}</Table.Cell>
        {/if}
        {#if hidableCoulumns[9].value}
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
              <DropdownMenu.Item on:click={() => handleProcessing(data.id)}
                >Order Processing</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={() => handlePacking(data.id)}
                >Order Packing</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={() => handleReady(data.id)}
                >Order Ready for Dispatch</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={() => handleShipped(data.id)}
                >Order Shipped</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={() => handleDelivered(data.id)}
                >Order Delivered</DropdownMenu.Item
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
