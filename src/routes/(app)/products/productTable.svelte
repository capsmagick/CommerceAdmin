<script lang="ts">
  import CaretSort from "svelte-radix/CaretSort.svelte";
  import ChevronDown from "svelte-radix/ChevronDown.svelte";
  import * as Avatar from "$lib/components/ui/avatar";
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
  import Actions from "./productTableActions.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { cn } from "$lib/utils.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import DataTableCheckbox from "./productTableCheckbox.svelte";
  import API from "$lib/services/api";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  type Product = {
    id: string;
    name: string;
    description: string;
    brand: string;
    price: number;
    stock: number;
    categories: string[];
    hsn_code: string;
    tags: string[];
    images:  string[];
    rating: number;
    no_of_reviews: number;
    is_disabled: boolean;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    short_description: string;
  };

  let next: any;
  let nextPage = false;
  let previous: any;
  let previousPage = false;

  // Create a readable store for the data
  const data = writable<Product[]>([], (set) => {
    getProducts().then((data) => {
      set(data);
    });
  });

  function createFunction() {
    dispatch("newAttribute");
  }

  export async function refreshTable() {
    location.reload();
  }

  async function getProducts() {
    try {
      let res;
      if (nextPage) {
        res = await API.get(next);
      } else if (previousPage) {
        res = await API.get(previous);
      } else {
        res = await API.get("/products/product/");
      }
      next = res.data.next;
      previous = res.data.previous;
      return res.data.results;
    } catch (error) {
      console.error("fetch:Product:", error);
      return [];
    }
  }

  async function getNextPage() {
    nextPage = true;
    previousPage = false;
    const newData = await getProducts();
    data.set(newData);
  }

  async function getPreviousPage() {
    nextPage = false;
    previousPage = true;
    const newData = await getProducts();
    data.set(newData);
  }

  const table = createTable(data, {
    sort: addSortBy({ disableMultiSort: true }),
    page: addPagination(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) => value.includes(filterValue),
    }),
    select: addSelectedRows(),
    hide: addHiddenColumns(),
  });

  const columns = table.createColumns([
    table.column({
      header: (_, { pluginStates }) => {
        const { allPageRowsSelected } = pluginStates.select;
        return createRender(DataTableCheckbox, {
          checked: allPageRowsSelected,
        });
      },
      accessor: "id",
      cell: ({ row }, { pluginStates }) => {
        const { getRowState } = pluginStates.select;
        const { isSelected } = getRowState(row);

        return createRender(DataTableCheckbox, {
          checked: isSelected,
        });
      },
      plugins: {
        sort: {
          disable: true,
        },
        filter: {
          exclude: true,
        },
      },
    }),
    table.column({
      header: "Images",
      accessor: "images",
      cell: ({ value }) => {
        console.log(value)
        return `<img src="${value}" alt="Profile Photo" class="h-10 w-10 rounded-full">`;
      },
    }),
    table.column({
      header: "Product Name",
      accessor: "name",
      cell: ({ value }) => value,
      plugins: {
        filter: {
          getFilterValue(value) {
            return value;
          },
        },
      },
    }),
    table.column({
      header: "Short Description",
      accessor: "short_description",
    }),
    table.column({
      header: "Description",
      accessor: "description",
      cell: ({ value }) => value,
      plugins: { filter: {} },
    }),
        table.column({
      header: "Brand",
      accessor: ({brand}) => brand.name,
    }),
    table.column({
      header: "HSN Code",
      accessor: "hsn_code",
      cell: ({ value }) => value,
      plugins: { sort: {}, filter: {} },
    }),
    table.column({
      header: "Tags",
      accessor: "tags",
      cell: ({ value }) => value.map(i => i.name).join(", "),
      plugins: { filter: {} },
    }),
    table.column({
      header: "Number of Reviews",
      accessor: "no_of_reviews",
      cell: ({ value }) => `${value} reviews`,
      plugins: { sort: {}, filter: {} },
    }),
    table.column({
      header: "Status",
      accessor: "is_disabled",
      cell: ({ value }) => value ? "Inactive" : "Active",
      plugins: { filter: {} },
    }),
    table.column({
      header: "Created At",
      accessor: "created_at",
      cell: ({ value }) => new Date(value).toLocaleDateString(),
      plugins: { sort: {}, filter: { exclude: true } },
    }),
    table.column({
      header: "Updated At",
      accessor: "updated_at",
      cell: ({ value }) => new Date(value).toLocaleDateString(),
      plugins: { sort: {}, filter: { exclude: true } },
    }),
    table.column({
      header: "Created By",
      accessor: "created_by",
      cell: ({ value }) => value,
      plugins: { filter: { exclude: true } },
    }),
    table.column({
      header: "Updated By",
      accessor: "updated_by",
      cell: ({ value }) => value,
      plugins: { filter: { exclude: true } },
    }),
    table.column({
      header: "Price",
      accessor: "price",
      cell: ({ value }) => {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
        return formatted;
      },
      plugins: { sort: {}, filter: { exclude: true } },
    }),
    table.column({
      header: "Stock",
      accessor: "stock",
      plugins: { sort: {}, filter: { exclude: true } },
    }),
    table.column({
      header: "Categories",
      accessor: "categories",
      cell: ({ value }) => value.map(category => category.name).join(", "),
      plugins: { sort: {}, filter: {} },
    }),
    table.column({
      header: "Rating",
      accessor: "rating",
      cell: ({ value }) => `${value} stars`,
      plugins: { sort: {}, filter: { exclude: true } },
    }),
    table.column({
      header: "Actions",
      accessor: ({ id }) => id,
      cell: (item) => {
        return createRender(Actions)
          .on("edit", (event: Actions["edit"]) => {
            dispatch("edit", { item });
          })
          .on("delete", (event: Actions["delete"]) => {
            dispatch("delete", { item });
          })
          .on("addVariant", (event: Actions["addVariant"]) => {
            dispatch("addVariant", { item });
          })
          .on("viewVariant", (event: Actions["viewVariant"]) => {
            dispatch("viewVariant", { item });
          })
          .on("addLookbook", (event: Actions["addLookbook"]) => {
            dispatch("addLookbook", { item });
          })
          .on("status", (event: Actions["status"]) => {
            dispatch("status", { item });
          });
      },
      plugins: {
        sort: {
          disable: true,
        },
      },
    }),
  ]);

  const {
    headerRows,
    pageRows,
    tableAttrs,
    tableBodyAttrs,
    flatColumns,
    pluginStates,
    rows,
  } = table.createViewModel(columns);

  const { sortKeys } = pluginStates.sort;

  const { hiddenColumnIds } = pluginStates.hide;
  const ids = flatColumns.map((c) => c.id);
  let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

  let initialHiddenColumns = [
    "created_at",
    "updated_at",
    "description",
    "hsn_code",
    "tags",
    "attributes",
    "created_by",
    "updated_by",
  ];

  $: hideForId = Object.fromEntries(
    ids.map((id) => [id, !initialHiddenColumns.includes(id)])
  );

  $: $hiddenColumnIds = Object.entries(hideForId)
    .filter(([, hide]) => !hide)
    .map(([id]) => id);

  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
  const { filterValue } = pluginStates.filter;

  const { selectedDataIds } = pluginStates.select;

  const hideableCols = [
    "categories",
    "rating",
    "created_at",
    "updated_at",
    "description",
    "short_description",
    "hsn_code",
    "tags",
    "attributes",
    "created_by",
    "updated_by",
  ];
</script>

<div class="w-full p-4 bg-background text-foreground">
  <div class="mb-4 flex items-center gap-4">
    <Input
      class="max-w-sm"
      placeholder="Filter Products..."
      type="text"
      bind:value={$filterValue}/>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button variant="outline" class="ml-auto" builders={[builder]}>
          Columns <ChevronDown class="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {#each flatColumns as col}
          {#if hideableCols.includes(col.id)}
            <DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
              {col.header}
            </DropdownMenu.CheckboxItem>
          {/if}
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
  <div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe
                  attrs={cell.attrs()}
                  let:attrs
                  props={cell.props()}
                  let:props>
                  <Table.Head
                    {...attrs}
                    class={cn("[&:has([role=checkbox])]:pl-3")}>
                    {#if cell.id === "name"}
                      <Button variant="ghost" on:click={props.sort.toggle}>
                        <Render of={cell.render()} />
                        <CaretSort
                          class={cn($sortKeys[0]?.id === cell.id && "text-foreground",
                            "ml-2 h-4 w-4")}/>
                      </Button>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
                  </Table.Head>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      <Table.Body {...$tableBodyAttrs}>
        {#each $pageRows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <Table.Row
              {...rowAttrs}
              data-state={$selectedDataIds[row.id] && "selected"}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
                    {#if typeof cell.render() === "string"}
                      {@html cell.render()}
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
                  </Table.Cell>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <div class="flex items-center justify-end space-x-2 py-4">
    <div class="flex-1 text-sm text-muted-foreground">
      {Object.keys($selectedDataIds).length} of{" "}
      {$rows.length} row(s) selected.
    </div>
    <Button
      variant="outline"
      size="sm"
      on:click={getPreviousPage}
      disabled={!previous}>
      Previous
    </Button>
    <Button variant="outline" size="sm" disabled={!next} on:click={getNextPage}>
      Next
    </Button>
  </div>
</div>