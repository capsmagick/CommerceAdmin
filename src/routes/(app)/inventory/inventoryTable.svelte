<script lang="ts">
    import CaretSort from "svelte-radix/CaretSort.svelte";
    import ChevronDown from "svelte-radix/ChevronDown.svelte";
    import * as Avatar from "$lib/components/ui/avatar";
    import {
      createTable,
      Subscribe,
      Render,
      createRender
    } from "svelte-headless-table";
    import {
      addSortBy,
      addPagination,
      addTableFilter,
      addSelectedRows,
    } from "svelte-headless-table/plugins";
    import { readable } from "svelte/store";
    import * as Table from "$lib/components/ui/table/index.js";
    import Actions from "./inventoryTableActions.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import { cn } from "$lib/utils.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import DataTableCheckbox from "./inventoryTableCheckbox.svelte";
    import API from "$lib/services/api";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();
    import type {ActionsEvents} from './Actions.svelte';
    
  type Inventories = {
  id: string;
  variants: string;
  stock: string;
  batch: string;
  low_stock_notification: string;
};

    // Create a readable store for the data
    const data = readable<Inventories[]>([], (set) => {
        getCategory().then((data) => {
            console.log(data);
            set(data);
        });
    });

    function createFunction() {
      dispatch('newAttribute')
    }

    export async function refreshTable() {
        location.reload();
    }

    async function getCategory() {
        try {
        const res = await API.get("/inventory/inventory/");
        return res.data.results;
        } catch (error) {
        console.error("fetch:brands:", error);
        return [];
        }
    }
   
   
    const table = createTable(data, {
      sort: addSortBy({ disableMultiSort: true }),
      page: addPagination(),
      filter: addTableFilter({
        fn: ({ filterValue, value }) => value.includes(filterValue)
      }),
      select: addSelectedRows(),
    });
   
     const columns = table.createColumns([
      table.column({
        header: (_, { pluginStates }) => {
          const { allPageRowsSelected } = pluginStates.select;
          return createRender(DataTableCheckbox, {
            checked: allPageRowsSelected
          });
        },
        accessor: "id",
        cell: ({ row }, { pluginStates }) => {
          const { getRowState } = pluginStates.select;
          const { isSelected } = getRowState(row);
   
          return createRender(DataTableCheckbox, {
            checked: isSelected
          });
        },
        plugins: {
          sort: {
            disable: true
          },
          filter: {
            exclude: true
          }
        }
      }),
      table.column({
        header: "Variants",
        accessor: "variants",
        cell: ({ value }) => new Date(value).toLocaleDateString(),
        plugins: { sort: {}, filter: { exclude: true } }
      }),
      table.column({
        header: "Stock",
        accessor: "stock",
        cell: ({ value }) => new Date(value).toLocaleDateString(),
        plugins: { sort: {}, filter: { exclude: true } }
      }),
      table.column({
        header: "Batch",
        accessor: "batch",
        cell: ({ value }) => value,
        plugins: { filter: { exclude: true } }
      }),
      table.column({
        header: "Actions",
        accessor: ({ id }) => id,
        cell: (item) => {
          return createRender(Actions, {item: item})
            .on('edit', (event: ActionsEvents['edit']) => {
                dispatch('edit', {item})
            })
            .on('delete', (event: ActionsEvents['delete']) => {
                dispatch('delete', {item})
            });
        },
        plugins: {
          sort: {
            disable: true
          }
        }
      })
    ]);
   
    const {
      headerRows,
      pageRows,
      tableAttrs,
      tableBodyAttrs,
      flatColumns,
      pluginStates,
      rows
    } = table.createViewModel(columns);
   
    const { sortKeys } = pluginStates.sort;
  
    const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
    const { filterValue } = pluginStates.filter;
   
    const { selectedDataIds } = pluginStates.select;
   
    const hideableCols = [ "createdAt", "updatedAt",'description', 'tags', 'createdBy', 'updatedBy'];
  </script>
   
  <div class="w-full">
    <div class="mb-4 p-4 flex items-center gap-4">
      <Input
        class="max-w-sm"
        placeholder="Filter Inventory..."
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
                    let:props
                  >
                    <Table.Head
                      {...attrs}
                      class={cn("[&:has([role=checkbox])]:pl-3")}
                    >
                      {#if cell.id === "amount"}
                        <div class="text-right">
                          <Render of={cell.render()} />
                        </div>
                      {:else if cell.id === "customerName"}
                        <Button variant="ghost" on:click={props.sort.toggle}>
                          <Render of={cell.render()} />
                          <CaretSort
                            class={cn(
                              $sortKeys[0]?.id === cell.id && "text-foreground",
                              "ml-2 h-4 w-4"
                            )}
                          />
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
                data-state={$selectedDataIds[row.id] && "selected"}
              >
                {#each row.cells as cell (cell.id)}
                  <Subscribe attrs={cell.attrs()} let:attrs>
                    <Table.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
                      {#if cell.id === "amount"}
                        <div class="text-right font-medium">
                          <Render of={cell.render()} />
                        </div>
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