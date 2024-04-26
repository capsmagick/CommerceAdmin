<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { createEventDispatcher, onMount } from "svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import API from "$lib/services/api";
  import Pagination from "$lib/components/ui/table-pagination/pagination.svelte";
  import CaretSort from "svelte-radix/CaretSort.svelte";
  import ChevronDown from "svelte-radix/ChevronDown.svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { MoreHorizontal } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import { Input } from "$lib/components/ui/input/index.js";
  import { goto } from "$app/navigation";

  const dispatch = createEventDispatcher();

  const baseUrl: string = import.meta.env.VITE_BASE_URL as string;

  let collectionData: any = [];

  const urlParams = new URLSearchParams(window.location.search);

  let id: any = urlParams.get("id");
  id? localStorage.setItem('collectionId', id):"";
  let collectionId: any = localStorage.getItem("collectionId");


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

  async function getCollection() {
    try {
      const response = await API.get(`/products/collection/${collectionId}`);
      collectionData = response.data.collection_items.map((i) => i.product);
      console.log(collectionData);
    } catch (error) {
      console.error("fetch:collection:", error);
      return [];
    }
  }

  function cancelModel() {
    dispatch("cancel");
  }

  onMount(async () => {
    await getCollection();
  });

  function pageLimit(event: any, value: any) {}
  function goBack() {
    localStorage.removeItem("collectionId");
    goto("/collection/");
  }
</script>

<div
  class="m-3 bg-background text-foreground rounded-md p-4 px-6 border"
  style="height: calc(100vh - 80px);"
>
  <div class="w-full p-5">
    <div class="my-2 flex justify-between">
      <div>
        <Input
          class="max-w-sm"
          placeholder="Search Categories..."
          type="text"
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
                10
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
            <Button variant="ghost"><CaretSort class="w-4 h-4" /></Button>
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
      {#each collectionData as data}
        <Table.Row>
          {#if hidableCoulumns[0].value}
            <Table.Cell>
              {#if data.images && data.images.length > 0}
                <img
                  src={`${baseUrl}${data.images[0].image}`}
                  alt="product_image"
                  class="w-12 h-12 object-cover rounded-full"
                />
              {:else}
                <span>No image available</span>
              {/if}
              <!-- {logImageUrl(data)} -->
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
            <Table.Cell>{data.is_disabled ? "Inactive" : "Active"}</Table.Cell>
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
                <!-- <DropdownMenu.Item on:click={() => onViewProduct(data)}>
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
              <DropdownMenu.Item on:click={() => addToCollection(data)}>
                Add To Collection</DropdownMenu.Item
              > -->
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Root>
  </div>
  <div class="flex justify-end">
    <Button class="text-end" on:click={goBack}>Go Back</Button>
  </div>
</div>
