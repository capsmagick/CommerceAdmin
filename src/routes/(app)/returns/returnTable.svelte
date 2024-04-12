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
    { name: "Return Reason", value: true },
    { name: "Purchase Bill", value: false },
    { name: "Rejected User", value: true },
    { name: "Rejected Comment", value: true },
    { name: "Rejected At", value: false },
    { name: "Refund Status", value: true },
  ];

  async function getReturns() {
    try {
      let res = await API.get(
        `/customer/manage/return-request/?page=${page}&per_page=${per_page}&ordering=${sortField}&search=${searchData}`
      );
      totalItems = res.data.total;
      tableData = res.data.results;
      console.log(tableData);
    } catch (error) {
      console.error("fetch:returns:", error);
      return [];
    }
  }

  async function getNextPage() {
    page += 1;
    await getReturns();
  }

  async function getPage(event: any) {
    page = event.detail;
    await getReturns();
  }

  async function getPreviousPage() {
    page -= 1;
    await getReturns();
  }

    async function handleApprove(id: any) {
    API.post(`customer/manage/return-request/${id}/approve/`)
      .then(() => {
        toast.success("Order status updated successfully");
        getReturns();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function handleMoveToDelivered(id: any) {
    API.post(`customer/manage/return-request/${id}/move-to-delivered/`)
      .then(() => {
        toast.success("Order status updated successfully");
        getReturns();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function handleMoveToIntransit(id: any) {
    API.post(`customer/manage/return-request/${id}/move-to-intransit/`)
      .then(() => {
        toast.success("Order status updated successfully");
        getReturns();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function handleMoveToRefundIntransit(id: any) {
    API.post(`customer/manage/return-request/${id}/move-to-refund-intransit/`)
      .then(() => {
        toast.success("Order status updated successfully");
        getReturns();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function handleMoveToRefunded(id: any) {
    API.post(`customer/manage/return-request/${id}/move-to-refunded/`)
      .then(() => {
        toast.success("Order status updated successfully");
        getReturns();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function handleMoveToReview(id: any) {
    API.post(`customer/manage/return-request/${id}/move-to-review/`)
      .then(() => {
        toast.success("Order status updated successfully");
        getReturns();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function handleReject(id: any) {
    API.post(`customer/manage/return-request/${id}/reject/`)
      .then(() => {
        toast.success("Order status updated successfully");
        getReturns();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function handleUpdateRefundDetails(id: any) {
    API.post(`customer/manage/return-request/${id}/update-refund-details/`)
      .then(() => {
        toast.success("Order status updated successfully");
        getReturns();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  onMount(() => {
    getReturns();
  });

  function sortName() {
    if (sortData) {
      sortField = "name";
      getReturns();
      sortData = !sortData;
    } else {
      sortField = "-name";
      getReturns();
      sortData = !sortData;
    }
  }

  function searchName(event: any) {
    searchData = event.target.value;
    getReturns();
  }

  function pageLimit(event: any, value: any) {
    per_page = value;
    getReturns();
  }
</script>

<div class="w-full p-5">
  <div class="my-2 flex justify-between">
    <div>
      <Input
        class="max-w-sm"
        placeholder="Search Returns..."
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
          >Product Name
          <Button on:click={() => sortName()} variant="ghost"
            ><CaretSort class="w-4 h-4" /></Button
          >
        </Table.Head>
        {#if hidableCoulumns[0].value}
          <Table.Head>Return Reason</Table.Head>
        {/if}
        {#if hidableCoulumns[1].value}
          <Table.Head>Purchase Bill</Table.Head>
        {/if}
        {#if hidableCoulumns[2].value}
          <Table.Head>Rejected User</Table.Head>
        {/if}
        {#if hidableCoulumns[3].value}
          <Table.Head>Rejected Comment</Table.Head>
        {/if}
        {#if hidableCoulumns[4].value}
          <Table.Head>Rejected At</Table.Head>
        {/if}
        {#if hidableCoulumns[5].value}
          <Table.Head>Refund Status</Table.Head>
        {/if}
        <Table.Head>Action</Table.Head>
      </Table.Row>
    </Table.Header>
    {#each tableData as data}
      <Table.Row>
        <Table.Cell>{data.product.name}</Table.Cell>
        {#if hidableCoulumns[0].value}
          <Table.Cell>{data.reason.description}</Table.Cell>
        {/if}
        {#if hidableCoulumns[1].value}
          <Table.Cell>
            <img
              src={data.purchase_bill}
              class="w-12 h-12 object-cover rounded-full"
              alt="purchase_bill"
            /></Table.Cell
          >
        {/if}
        {#if hidableCoulumns[2].value}
          <Table.Cell
            >{data.rejected_user.first_name}
            {data.rejected_user.last_name}</Table.Cell
          >
        {/if}
        {#if hidableCoulumns[3].value}
          <Table.Cell>{data.rejected_comment}</Table.Cell>
        {/if}
        {#if hidableCoulumns[4].value}
          <Table.Cell>{data.rejected_at}</Table.Cell>
        {/if}
        {#if hidableCoulumns[5].value}
          <Table.Cell>{data.refund_status}</Table.Cell>
        {/if}
        <Table.Cell>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button builders={[builder]} variant="ghost"
                ><MoreHorizontal class="h-4 w-4" /></Button
              >
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="absolute">
              <DropdownMenu.Item on:click={() => handleApprove(data.id)}>Approve</DropdownMenu.Item>
              <DropdownMenu.Item on:click={() => handleMoveToDelivered(data.id)}>Move to Delivered</DropdownMenu.Item>
              <DropdownMenu.Item on:click={() => handleMoveToIntransit(data.id)}>Move to Intransit</DropdownMenu.Item>
              <DropdownMenu.Item on:click={() => handleMoveToRefundIntransit(data.id)}>Move to Refund Initiated</DropdownMenu.Item>
              <DropdownMenu.Item on:click={() => handleMoveToRefunded(data.id)}>Move to Refund</DropdownMenu.Item>
              <DropdownMenu.Item on:click={() => handleMoveToReview(data.id)}>Move to Review</DropdownMenu.Item>
              <DropdownMenu.Item on:click={() => handleReject(data.id)}>Reject</DropdownMenu.Item>
              <DropdownMenu.Item on:click={() => handleUpdateRefundDetails(data.id)}>Move to Review</DropdownMenu.Item>
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
