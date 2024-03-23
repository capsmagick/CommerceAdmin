<script lang="ts">
    import CaretSort from "svelte-radix/CaretSort.svelte";
    import ChevronDown from "svelte-radix/ChevronDown.svelte";
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
    import { writable } from "svelte/store";
    import * as Table from "$lib/components/ui/table/index.js";
    // import Actions from "./customerTableActions.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { cn } from "$lib/utils.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import DataTableCheckbox from "./customerTableCheckbox.svelte";
     import API from "$lib/services/api";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();
    // import type {ActionsEvents} from './Actions.svelte';
   
    type Customers = {
      username: string;
      first_name: string;
      status: "Pending" | "Processing" | "Success" | "Failed";
      email: string;
      mobile_number: number;
      shippingAddress: string;
    };

    let next: any;
    let nextPage = false;
    let previous: any;
    let previousPage = false;

    // Create a readable store for the data
    const data = writable<Customers[]>([], (set) => {
        getCustomers().then((data) => {
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

    async function getCustomers() {
        try {
            let res;
            if(nextPage) {
                res = await API.get(next);
            } else if (previousPage) {
                res = await API.get(previous);
            } else {
                res = await API.get("/account/customers/?page=1&per_page=10");
            }
            next = res.data.next;
            previous = res.data.previous;
            return res.data.results;
        } catch (error) {
        console.error("fetch:customers:", error);
        return [];
        }
    }

        async function getNextPage () {
        nextPage = true;
        previousPage = false;
        const newData = await getCustomers(); 
        data.set(newData);
    }

    async function getPreviousPage () {
        nextPage = false;
        previousPage = true;
        const newData = await getCustomers(); 
        data.set(newData);
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
        accessor: "username",
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
        header: "Name",
        accessor: "first_name",
        plugins: { sort: { disable: true }, filter: { exclude: true } }
      }),
      table.column({
        header: "Email",
        accessor: "email",
        cell: ({ value }) => value.toLowerCase(),
        plugins: {
          filter: {
            getFilterValue(value) {
              return value.toLowerCase();
            }
          }
        }
      }),
      table.column({
        header: "Phone Number",
        accessor: "mobile_number",
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
        header: "Shipping Address",
        accessor: "shippingAddress",
        plugins: { sort: { disable: true }, filter: { exclude: true } }
      }),
        table.column({
        header: "Status",
        accessor: "status",
        plugins: { sort: { disable: true }, filter: { exclude: true } }
      }),
      // table.column({
      //   header: "",
      //   accessor: ({ id }) => id,
      //   cell: (item) => {
      //     return createRender(Actions, { id: item.value });
      //   },
      //   plugins: {
      //     sort: {
      //       disable: true
      //     }
      //   }
      // })
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
   
    $: $hiddenColumnIds = Object.entries(hideForId)
      .filter(([, hide]) => !hide)
      .map(([id]) => id);
   
    const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
    const { filterValue } = pluginStates.filter;
   
    const { selectedDataIds } = pluginStates.select;
   
    const hideableCols = ["status", "email", "phoneNumber", "shippingAddress"];
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
                      {:else if cell.id === "email"}
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
        on:click={getPreviousPage}
        disabled={!previous}>Previous</Button
      >
      <Button
        variant="outline"
        size="sm"
        disabled={!next}
        on:click={getNextPage}>Next</Button
      >
    </div>
  </div>