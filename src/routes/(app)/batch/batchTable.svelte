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
      addHiddenColumns
    } from "svelte-headless-table/plugins";
    import { readable } from "svelte/store";
    import * as Table from "$lib/components/ui/table/index.js";
    import Actions from "./batchTableActions.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { cn } from "$lib/utils.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import DataTableCheckbox from "./batchTableCheckbox.svelte";
    import API from "$lib/services/api";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();
    import type {ActionsEvents} from './Actions.svelte';
    
  type Batch = {
  id: string;
  warehouse: string;
  batch_number: string;
  rack: string;
  row: string;
  expiry_date: string;
  purchase_amount: string;
  mrp: string;
  selling_price: string;
  purchase_quantity: string;
  stock: string;
  is_perishable: string;
  is_disabled: string;
  tax_inclusive: string;
  purchase_amount_tax_inclusive: string;
  tax: string;
};

    // Create a readable store for the data
    const data = readable<Batch[]>([], (set) => {
        getBatch().then((data) => {
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

    async function getBatch() {
        try {
        const res = await API.get("/inventory/batch/");
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
      hide: addHiddenColumns()
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
        header: "Warehouse",
        accessor: "warehouse",
        cell: ({ value }) => `<img src="${value}" alt="Featured Image" class="h-10 w-10 rounded-full">`,
        plugins: { filter: { exclude: true } }
      }),
    
      table.column({
        header: "Batch Number",
        accessor: "batch_number",
        cell: ({ value }) => value,
        plugins: {
          filter: {
            getFilterValue(value) {
              return value;
            }
          }
        }
      }),
      table.column({
        header: "Expiry Date",
        accessor: "expiry_date",
        cell: ({ value }) => value,
        plugins: { filter: {} }
      }),
      table.column({
        header: "Purchase Amount",
        accessor: "purchase_amount",
        cell: ({ value }) => value,
        plugins: { filter: {} }
      }),
      table.column({
        header: "MRP",
        accessor: "mrp",
        cell: ({ value }) => value,
        plugins: { filter: {} }
      }),
    
      table.column({
        header: "Selling Price",
        accessor: "selling_price",
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
   
    const { hiddenColumnIds } = pluginStates.hide;
    const ids = flatColumns.map((c) => c.id);
    let hideForId = Object.fromEntries(ids.map((id) => [id, true]));
    
    let initialHiddenColumns = [ 'batch_number'];

    $: hideForId = Object.fromEntries(ids.map((id) => [id, !initialHiddenColumns.includes(id)]));

    $: $hiddenColumnIds = Object.entries(hideForId)
      .filter(([, hide]) => !hide)
      .map(([id]) => id);
   
    const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
    const { filterValue } = pluginStates.filter;
   
    const { selectedDataIds } = pluginStates.select;
   
    const hideableCols = [ 'batch_number','rack','row','expiry_date','purchase_amount','mrp','selling_price','purchase_quantity','stock','is_perishable','is_disabled','tax_inclusive','purchase_amount_tax_inclusive','tax'];
  </script>
   
  <div class="w-full">
    <div class="mb-4 p-4 flex items-center gap-4">
      <Input
        class="max-w-sm"
        placeholder="Filter Customer..."
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