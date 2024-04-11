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
  } from "svelte-headless-table/plugins";
  import { readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table/index.js";
  import Actions from "./variantTableActions.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import DataTableCheckbox from "./variantTableCheckbox.svelte";
  import API from "$lib/services/api";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let productId: any;

  const urlParams = new URLSearchParams(window.location.search);
  productId = urlParams.get('userId');
  console.log("Product ID from URL:", productId);

  type Variant = {
    id: string;
    name: string;
    product: string[];
    attributes: { name: string, value: string }[];
    selling_price: string;
    stock: number;
    images: string;
  };

  const data = readable<Variant[]>([], (set) => {
    getVariant().then((data) => {
      console.log(data);
      set(data);
    });
  });

  export async function refreshTable() {
    location.reload();
  }

  async function getVariant() {
    try {
      const res = await API.get(`/products/variant/?product=${productId}`);
      return res.data.results;
      console.log("res", res);
    } catch (error) {
      console.error("fetch:brands:", error);
      return [];
    }
  }

  const table = createTable(data, {
    sort: addSortBy({ disableMultiSort: true }),
    page: addPagination(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) => value.includes(filterValue),
    }),
    select: addSelectedRows(),
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
      header: "Product Name",
      accessor: "product",
      cell: ({ value }) => value.name,
    }),
    table.column({
      header: "Image",
      accessor: "images",
      cell: ({ value }) =>{
      if (Array.isArray(value) && value.length > 0) {
        const imageUrl = value[0].image;
        console.log("img:",imageUrl);
        return `<img src="http://localhost:8000${imageUrl}" alt="Featured Image" class="h-10 w-10 rounded-full">`;//image api update backend 
      } else {
        return 'No Image';
      }
    },
      plugins: { filter: { exclude: true } },
    }),
    table.column({
      header: "Attributes",
      accessor: "attributes",
      cell: ({ value }) => {
        if (Array.isArray(value) && value.length > 0) {
          const attributeValues = value.map(attr => `${attr.attributes.name}: ${attr.value}`).join(', ');
          return attributeValues;
        } else {
          return 'No Attributes';
        }
      },
    }),
    table.column({
      header: "Selling Price",
      accessor: "selling_price",
      cell: ({ value }) => value,
    }),
    table.column({
      header: "Stock",
      accessor: "stock",
      cell: ({ value }) => value,
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

  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
  const { filterValue } = pluginStates.filter;

  const { selectedDataIds } = pluginStates.select;
</script>

<div class="w-full">
  <div class="mb-4 p-4 flex items-center gap-4">
    <Input
      class="max-w-sm"
      placeholder="Filter Variant..."
      type="text"
      bind:value={$filterValue}
    />
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
                    {#if cell.id === "product"}
                      <Button variant="ghost" on:click={props.sort.toggle}>
                        <Render of={cell.render()} />
                        <CaretSort
                          class={cn(
                            $sortKeys[0]?.id === cell.id && "text-foreground",
                            "ml-2 h-4 w-4"
                          )}/>
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
      on:click={() => ($pageIndex = $pageIndex - 1)}
      disabled={!$hasPreviousPage}>Previous</Button
    >
    <Button
      variant="outline"
      size="sm"
      disabled={!$hasNextPage}
      on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
    >
  </div>
</div>