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
  import Actions from "./tagTableActions.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import DataTableCheckbox from "./tagTableCheckbox.svelte";
  import API from "$lib/services/api";
  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  const dispatch = createEventDispatcher();
  

  type Tag = {
    id: string;
    name: string;
  };

    let next: any;
    let nextPage = false;
    let previous: any;
    let previousPage = false;

  // Create a readable store for the data
  export const data = writable<Tag[]>([], (set) => {
        getTags().then((data) => {
            set(data);
        });
    });
  function createFunction() {
    dispatch("newAttribute");
  }

  export async function refreshTable() {
    //location.reload();
    try {
      const newData: Tag[] = await getTags();
      data.set(newData);
      console.log("Tags Refreshed:", newData);
    } catch (error) {
      console.error("Error refreshing table:", error);
    }
  }



  async function getTags() {
    try {
          let res;
            if(nextPage) {
                res = await API.get(next);
            } else if (previousPage) {
                res = await API.get(previous);
            } else {
                res = await API.get("/masterdata/tag/");
            }
            next = res.data.next;
            previous = res.data.previous;
            return res.data.results;    
        } catch (error) {
            console.error("fetch:Tags:", error);
            return [];
        }
    }

        async function getNextPage () {
        nextPage = true;
        previousPage = false;
        const newData = await getTags(); 
        data.set(newData);
    }

    async function getPreviousPage () {
        nextPage = false;
        previousPage = true;
        const newData = await getTags(); 
        data.set(newData);
    }

    const table = createTable(data, {
      sort: addSortBy({ disableMultiSort: true }),
      page: addPagination(),
      filter: addTableFilter({
        fn: ({ filterValue, value }) => value.includes(filterValue),
      }),
      select: addSelectedRows(),
    });
//async function InitalizeTable() {
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
          // console.log("Row ID:", row.original.id);
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
        header: "Name",
        accessor: "name",
        cell: ({ value }) => value,
        plugins: { sort: {}, filter: { exclude: true } },
      }),
      table.column({
        header: "ID",
        accessor: ({ id }) => id,
        cell: ({ value }) => value,
        plugins: { sort: {}, filter: { exclude: true } },
      }),
      table.column({
        header: "Original ID",
        accessor: ({ id }) => id,
        plugins: { sort: {}, filter: { exclude: true } },
      }),
      table.column({
        header: "Actions",
        accessor: ({ id }) => id,
        cell: (item) => {
                return createRender(Actions)
                    .on('edit', (event: Actions['edit']) => {
                        dispatch('edit', {item})
                    })
                    .on('delete', (event: Actions['delete']) => {
                        dispatch('delete', {item})
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
      placeholder="Filter Tags..."
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
                  <Table.Head class={cn("[&:has([role=checkbox])]:pl-3")} {...attrs}>
                        <Render of={cell.render()} />
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
