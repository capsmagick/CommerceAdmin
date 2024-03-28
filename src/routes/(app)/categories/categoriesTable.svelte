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
  import Actions from "./categoriesTableActions.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { cn } from "$lib/utils.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import DataTableCheckbox from "./categoriesTableCheckbox.svelte";
  import API from "$lib/services/api";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  type Categories = {
    id: string;
    name: string;
    description: string;
    tags: string[]; // Corrected type
    image: string;
    status: string[];
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    parent_category: string;
    second_parent_category: string;
  };

  let next: any;
  let nextPage = false;
  let previous: any;
  let previousPage = false;

  // Create a readable store for the data
  const data = writable<Categories[]>([], (set) => {
    getCategory().then((data) => {
      set(data);
    });
  });

  function createFunction() {
    dispatch("newCategory");
  }

  export async function refreshTable() {
    location.reload();
  }

  async function getCategory() {
    try {
      let res;
      if (nextPage) {
        res = await API.get(next);
      } else if (previousPage) {
        res = await API.get(previous);
      } else {
        res = await API.get("/masterdata/category/");
      }
      next = res.data.next;
      previous = res.data.previous;
      return res.data.results;
    } catch (error) {
      console.error("fetch:category:", error);
      return [];
    }
  }

  async function getNextPage() {
    nextPage = true;
    previousPage = false;
    const newData = await getCategory();
    data.set(newData);
  }

  async function getPreviousPage() {
    nextPage = false;
    previousPage = true;
    const newData = await getCategory();
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
      header: "ID",
      accessor: ({ id }) => id,
      plugins: { sort: { disable: true }, filter: { exclude: true } },
    }),
    table.column({
      header: "Category",
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
      header: "Image",
      accessor: "image",
      cell: ({ value }) =>
        `<img src="${value}" alt="Featured Image" class="h-10 w-10 rounded-full">`,
      plugins: { filter: { exclude: true } },
    }),
    table.column({
      header: "Parent category",
      accessor: "parent_category",
    }),
    table.column({
      header: "Second parent category",
      accessor: "second_parent_category",
    }),
    table.column({
      header: "Description",
      accessor: "description",
      cell: ({ value }) => value,
      plugins: { filter: { exclude: true } },
    }),
    table.column({
      header: "Tags",
      accessor: "tags",
      cell: ({ value }) => value.map((tag) => tag.name).join(", "),
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

  let initialHiddenColumns = [
    "ID",
    "created_at",
    "updated_at",
    "attributes",
    "created_by",
    "updated_by",
    "parent_category",
    "second_parent_category",
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
    "ID",
    "created_at",
    "updated_at",
    "description",
    "tags",
    "created_by",
    "updated_by",
    "parent_category",
    "second_parent_category",
  ];
</script>

<div class="w-full">
    <div class="mb-4 p-4 flex items-center gap-4">
        <Input
                class="max-w-sm"
                placeholder="Filter Category..."
                type="text"
                bind:value={$filterValue}
        />
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
                <Button variant="outline" class="ml-auto" builders={[builder]}>
                    Columns
                    <ChevronDown class="ml-2 h-4 w-4"/>
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
                                                <Render of={cell.render()}/>
                                                <CaretSort 
                                                class={cn($sortKeys[0]?.id === cell.id && "text-foreground","ml-2 h-4 w-4")}/>
                                            </Button>
                                        {:else}
                                            <Render of={cell.render()}/>
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
                disabled={!previous}>Previous
        </Button
        >
        <Button
                variant="outline"
                size="sm"
                disabled={!next}
                on:click={getNextPage}>Next
        </Button
        >
    </div>
</div>