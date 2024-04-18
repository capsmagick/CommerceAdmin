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
  import CreateProduct from "./createProduct/+page.svelte";
  import CreateVariant from "./variant/createVariant/+page.svelte";
  import { goto } from "$app/navigation";
  import AddToLookbook from "./addToLookbook/+page.svelte";
  import { productIdStore } from "../../../lib/stores/data";
  import ViewProduct from "./viewProduct/+page.svelte";

  let dispatch = createEventDispatcher();

  export let showForm: boolean = false;
  let showVariantForm: boolean = false;
  let lookbookModalForm: boolean = false;
  let viewProduct = false;

  // variables to handle pagination and table details
  let page: number = 1;
  let totalItems: number;
  let per_page: number = 10;
  let tableData: any[] = [];
  let sortData: boolean = true;
  let sortField: string = "";
  let searchData: string = "";

  let showDeleteModal = false;
  let deletingProduct: any;

  let editData: any;
  let editForm: boolean = false;
  let productID: any;
  let productData2: any;

  let hidableCoulumns: any[] = [
    { name: "Images", value: true },
    { name: "Short Description", value: true },
    { name: "Description", value: false },
    { name: "Brand", value: true },
    { name: "HSN Code", value: true },
    { name: "Tags", value: true },
    { name: "Number of Reviews", value: false },
    { name: "Status", value: true },
    { name: "Created At", value: false },
    { name: "Updated At", value: false },
    { name: "Created By", value: false },
    { name: "Updated By", value: false },
    { name: "Price", value: true },
    { name: "Stock", value: true },
    { name: "Categories", value: true },
    { name: "Rating", value: false },
  ];

  async function getProducts() {
    try {
      let res = await API.get(
        `/products/product/?page=${page}&per_page=${per_page}&ordering=${sortField}&search=${searchData}`
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
    await getProducts();
  }

  async function getPage(event: any) {
    page = event.detail;
    await getProducts();
  }

  async function getPreviousPage() {
    page -= 1;
    await getProducts();
  }

  function onEditProduct(data: any) {
    editData = data;
    showForm = true;
    editForm = true;
  }

  function handleNewProduct() {
    editData = null;
    editForm = false;
    showForm = false;
    getProducts();
  }

  function onDelete(id: any, name: any) {
    showDeleteModal = true;
    deletingProduct = {
      id: id,
      name: name,
    };
  }

  function viewVariant(data: any) {
    productID = data.id;
    productData2 = data;
    goto(`/products/variant?product=${productID}`);
  }

  function confirmDelete() {
    API.delete(`/products/product/${deletingProduct.id}/delete_record/`)
      .then(() => {
        closeDeleteModal();
        getProducts();
        toast("Product Deleted Successfully!");
      })
      .catch((error) => {
        console.error("Error deleting Product:", error);
        closeDeleteModal();
      });
  }

  function closeDeleteModal() {
    showDeleteModal = false;
  }

  function colseProduct() {
    editData = null;
    editForm = false;
    showForm = false;
    dispatch("cancel");
  }

  function addVariant(data: any) {
    productData2 = data;
    console.log("productData2: ", productData2);
    showVariantForm = true;
  }

  function addLookbook(data: any) {
    productIdStore.set(data.id);
    lookbookModalForm = true;
  }

  async function onChangeStatus(data: any) {
    let status = data.is_disabled;
    let url = !status
      ? `/products/product/${data.id}/enable/`
      : `/products/product/${data.id}/disable/`;

    API.post(url)
      .then(() => {
        toast.success("Product status updated successfully");
        getProducts();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function onViewProduct(data: any) {
    editData = data.id;
    viewProduct = true;
    editForm = true;
  }

  onMount(() => {
    getProducts();
  });

  function sortName() {
    if (sortData) {
      sortField = "name";
      getProducts();
      sortData = !sortData;
    } else {
      sortField = "-name";
      getProducts();
      sortData = !sortData;
    }
  }

  function searchName(event: any) {
    searchData = event.target.value;
    getProducts();
  }

  function pageLimit(event: any, value: any) {
    per_page = value;
    getProducts();
  }
</script>

<div>
  {#if showDeleteModal}
    <ConfirmDeleteModal
      attribute={deletingProduct.name}
      on:confirm={confirmDelete}
      on:cancel={closeDeleteModal}
    />
  {/if}
</div>

<div class="abc">
  {#if showForm}
    <CreateProduct
      {editData}
      {editForm}
      on:cancel={colseProduct}
      on:newProduct={() => handleNewProduct()}
    />
  {/if}
</div>
<div>
  {#if showVariantForm}
    <CreateVariant
      {productData2}
      {editData}
      {editForm}
      on:cancel={() => {
        editData = null;
        editForm = false;
        showVariantForm = false;
      }}
      on:newVariant={() => {
        editData = null;
        showVariantForm = false;
      }}
    />
  {/if}
</div>
<div>
  {#if lookbookModalForm}
    <AddToLookbook
      {editData}
      {editForm}
      on:newLookbook={() => {
        lookbookModalForm = false;
      }}
      on:cancel={() => {
        lookbookModalForm = false;
      }}
    />
  {/if}
</div>
<div>
  {#if viewProduct}
    <ViewProduct
      {editData}
      on:cancel={() => (
        (editData = null), (viewProduct = false), (editForm = false)
      )}
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
        {#if hidableCoulumns[0].value}
          <Table.Head>Images</Table.Head>
        {/if}
        <Table.Head>
          Product Name
          <Button on:click={() => sortName()} variant="ghost"
            ><CaretSort class="w-4 h-4" /></Button
          >
        </Table.Head>
        {#if hidableCoulumns[1].value}
          <Table.Head>Short Description</Table.Head>
        {/if}
        {#if hidableCoulumns[2].value}
          <Table.Head>Description</Table.Head>
        {/if}
        {#if hidableCoulumns[3].value}
          <Table.Head>Brand</Table.Head>
        {/if}
        {#if hidableCoulumns[4].value}
          <Table.Head>HSN Code</Table.Head>
        {/if}
        {#if hidableCoulumns[5].value}
          <Table.Head>Tags</Table.Head>
        {/if}
        {#if hidableCoulumns[6].value}
          <Table.Head>Number of Reviews</Table.Head>
        {/if}
        {#if hidableCoulumns[7].value}
          <Table.Head>Status</Table.Head>
        {/if}
        {#if hidableCoulumns[8].value}
          <Table.Head>Created At</Table.Head>
        {/if}
        {#if hidableCoulumns[9].value}
          <Table.Head>Updated At</Table.Head>
        {/if}
        {#if hidableCoulumns[10].value}
          <Table.Head>Created By</Table.Head>
        {/if}
        {#if hidableCoulumns[11].value}
          <Table.Head>Updated By</Table.Head>
        {/if}
        {#if hidableCoulumns[12].value}
          <Table.Head>Price</Table.Head>
        {/if}
        {#if hidableCoulumns[13].value}
          <Table.Head>Stock</Table.Head>
        {/if}
        {#if hidableCoulumns[14].value}
          <Table.Head>Categories</Table.Head>
        {/if}
        {#if hidableCoulumns[15].value}
          <Table.Head>Rating</Table.Head>
        {/if}
        <Table.Head>Action</Table.Head>
      </Table.Row>
    </Table.Header>
    {#each tableData as data}
      <Table.Row>
        {#if hidableCoulumns[0].value}
          <Table.Cell>
            <img
              src={data.image}
              alt="Logo"
              class="w-12 h-12 object-cover rounded-full"
            />
          </Table.Cell>
        {/if}
        <Table.Cell>{data.name}</Table.Cell>
        {#if hidableCoulumns[1].value}
          <Table.Cell>{data.short_description}</Table.Cell>
        {/if}
        {#if hidableCoulumns[2].value}
          <Table.Cell>{data.description}</Table.Cell>
        {/if}
        {#if hidableCoulumns[3].value}
          <Table.Cell>{data.brand.name}</Table.Cell>
        {/if}
        {#if hidableCoulumns[4].value}
          <Table.Cell>{data.hsn_code}</Table.Cell>
        {/if}
        {#if hidableCoulumns[5].value}
          <Table.Cell>{data.tags.map((i) => i.name).join(" ,")}</Table.Cell>
        {/if}
        {#if hidableCoulumns[6].value}
          <Table.Cell>{data.no_of_reviews} reviews</Table.Cell>
        {/if}
        {#if hidableCoulumns[7].value}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button builders={[builder]} variant="ghost" class=" font-normal">
                {data.is_disabled ? "Inactive" : "Active"}
                <ChevronDown class="ml-2 h-4 w-4" /></Button
              >
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="absolute">
              <DropdownMenu.Item
                on:click={() => onChangeStatus(data)}
                class="Item"
              >
                {data.is_disabled ? "Active" : "Inactive"}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        {/if}
        {#if hidableCoulumns[8].value}
          <Table.Cell>{data.created_at}</Table.Cell>
        {/if}
        {#if hidableCoulumns[9].value}
          <Table.Cell>{data.updated_at}</Table.Cell>
        {/if}
        {#if hidableCoulumns[10].value}
          <Table.Cell>{data.created_by}</Table.Cell>
        {/if}
        {#if hidableCoulumns[11].value}
          <Table.Cell>{data.updated_by}</Table.Cell>
        {/if}
        {#if hidableCoulumns[12].value}
          <Table.Cell>{data.price}</Table.Cell>
        {/if}
        {#if hidableCoulumns[13].value}
          <Table.Cell>{data.stock}</Table.Cell>
        {/if}
        {#if hidableCoulumns[14].value}
          <Table.Cell
            >{data.categories
              .map((category) => category.name)
              .join(", ")}</Table.Cell
          >
        {/if}
        {#if hidableCoulumns[15].value}
          <Table.Cell>{data.rating} stars</Table.Cell>
        {/if}
        <Table.Cell>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button builders={[builder]} variant="ghost"
                ><MoreHorizontal class="h-4 w-4" /></Button
              >
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="absolute">
              <DropdownMenu.Item on:click={() => onViewProduct(data)}>
                <i class="fa fa-eye sm mr-2"> </i>View</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={() => onEditProduct(data)}>
                <i class="fa fa-pencil sm mr-2"> </i>Edit</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={() => onDelete(data.id, data.name)}>
                <i class="fa fa-trash sm mr-2" style="color:red">
                </i>Delete</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={() => addVariant(data)}>
                Add Variant</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={() => viewVariant(data)}>
                View Variant</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={() => addLookbook(data)}>
                Add Lookbook</DropdownMenu.Item
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
