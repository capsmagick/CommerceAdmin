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
  import Actions from "./lookbookTableActions.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import { cn } from "$lib/utils.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import DataTableCheckbox from "./lookbookTableCheckbox.svelte";
  import API from "$lib/services/api";
  import { createEventDispatcher, onMount } from "svelte";
  import { lookbookDetailsStore } from "$lib/stores/data";
  const dispatch = createEventDispatcher();

  type Lookbook = {
    id: string;
    product: object;
    selling_price: string;
    stock: number;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
  };

  const lookbook = writable<Lookbook[]>([], (set) => {
    getLookbookData().then((data) => {
      set(data);
      console.log(data);
    });
  });


 
  async function getLookbookData() {
    try {
      let lookbookId = await lookbookDetailsStore.set;
      let res = await API.get(`/products/look-book/${lookbookId}/`);
      let variants = res.data.variants;
      let varDetails: any[] = [];

      for(let i = 0; i <variants.length; i++){
        let response = await API.get(`/products/variant/${variants[i]}`);
        varDetails.push(response.data)
      }
      return varDetails;
      
    } catch (error) {
      console.error("fetch:brands:", error);
    }
  }

  const table = createTable(lookbook, {
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
    // table.column({
    //   header: "Name",
    //   accessor: "product",
    //   cell: ({ value }) => value.name,
    //   plugins: {
    //     filter: {
    //       getFilterValue(value) {
    //         return value;
    //       },
    //     },
    //   },
    // }),
    table.column({
      header: "Selling Price",
      accessor: "selling_price",
      plugins: { sort: {}, filter: { exclude: true } },
    }),
      table.column({
      header: "Stock",
      accessor: "stock",
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

  let initialHiddenColumns = ["updated_ay", "created_by", "updated_by"];

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
    "created_at",
    "updated_at",
    "updated_ay",
    "created_by",
    "updated_by",
  ];


</script>

<div class="w-full">
  <div class="mb-4 p-4 flex items-center gap-4">
    <Input
      class="max-w-sm"
      placeholder="Filter Lookboook..."
      type="text"
      bind:value={$filterValue}
    />
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
    <!-- <div class="flex justify-center my-3"><Label class="text-center text-xl">{lookbookData ? lookbookData.name : ''}</Label></div> -->

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
                    {#if cell.id === "customerName"}
                      <Button variant="ghost" on:click={props.sort.toggle}>
                        <Render of={cell.render()} />
                        <CaretSort
                          class={cn($sortKeys[0]?.id === cell.id && "text-foreground",
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
                      <Render of={cell.render()} />
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
        disabled={!$hasPreviousPage}>Previous</Button>
    <Button variant="outline" size="sm" disabled={!$hasNextPage}
        on:click={() => ($pageIndex = $pageIndex + 1)}>
      Next</Button>
  </div>
</div>