<script lang="ts">
    import CaretSort from "svelte-radix/CaretSort.svelte";
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
    import Actions from "./attributeGroupTableActions.svelte"
    import { Button } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { cn } from "$lib/utils.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import DataTableCheckbox from "./attributeGroupTableCheckbox.svelte"
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import API from "$lib/services/api";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();
    import type {ActionsEvents} from './Actions.svelte';
   
    type AttributeGroup = {
        id: string;
        name: string;
        attributes: string;
    };

    // Create a readable store for the data
    const data = readable<AttributeGroup[]>([], (set) => {
        getAttributes().then((data) => {
            console.log(data);
            set(data);
        });
    });

    function createFunction() {
      dispatch('newAttributeGroup')
    }

    export async function refreshTable() {
        location.reload();
    }

    async function getAttributes() {
        try {
        const res = await API.get("/masterdata/attributegroup/");
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
            header: "ID",
            accessor: ({id}) => id,
            plugins: {sort: {disable: true}, filter: {exclude: true}}
        }),
      table.column({
        header: "Name",
        accessor: "name",
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
            header: "Attributes",
            accessor: "attributes",
            plugins: {sort: {disable: true}, filter: {exclude: true}}
        }),
      table.column({
        header: "Actions  ",
        accessor: ({ id }) =>  id,
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
   
    const ids = flatColumns.map((c) => c.id);
    let hideForId = Object.fromEntries(ids.map((id) => [id, true]));
   
    const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
    const { filterValue } = pluginStates.filter;
   
    const { selectedDataIds } = pluginStates.select;
   
    const hideableCols = ["name"];
  </script>
   
  <div class="w-full">
    <div class="mb-4 p-4 flex items-center gap-4">
      <Input
        class="max-w-sm"
        placeholder="Filter Attribute Group..."
        type="text"
        bind:value={$filterValue}/>
      <DropdownMenu.Root>
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
                data-state={$selectedDataIds[row.id] && "selected"}
              >
                {#each row.cells as cell (cell.id)}
                  <Subscribe attrs={cell.attrs()} let:attrs>
                    <Table.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
                      
                        {#if typeof cell.render() === 'string'}
                            {@html cell.render()}
                        {:else}
                            <Render of={cell.render()}/> 
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