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
    import Actions from "./categoriesTableActions.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { cn } from "$lib/utils.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import DataTableCheckbox from "./categoriesTableCheckbox.svelte";

      // Import statements and other script content...

 
   
    
    type Categories = {
  categoryId: string;
  name: string;
  description: string;
  tags: string[]; // Corrected type
  Image: string;
  status: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};
   
  
    const data:Categories[] = [
      {
        categoryId: "cat123",
        name: "Tech Gadgets",
        description: "Latest technology gadgets",
        tags: ["tech", "gadgets", "electronics"],
        Image: "https://github.com/shadcn.png",
        status: ["Active"],
        createdAt: "2021-09-10T10:30:00",
        updatedAt: "2021-09-15T14:20:00",
        createdBy: "admin",
        updatedBy: "admin"
      },
      {
        categoryId: "cat456",
        name: "Home Essentials",
        description: "Essential goods for your home",
        tags: ["home", "essentials", "decor"],
        Image: "https://example.com/home-essentials.png",
        status: ["Active", "Featured"],
        createdAt: "2021-10-05T09:20:00",
        updatedAt: "2021-10-10T16:45:00",
        createdBy: "user1",
        updatedBy: "user2"
      },
      {
        categoryId: "cat789",
        name: "Outdoor Adventure",
        description: "Gear and gadgets for the great outdoors",
        tags: ["outdoor", "adventure", "gear"],
        Image: "https://example.com/outdoor-adventure.png",
        status: ["Active"],
        createdAt: "2021-11-15T11:00:00",
        updatedAt: "2021-11-20T18:30:00",
        createdBy: "admin",
        updatedBy: "admin"
      },
      {
        categoryId: "cat101",
        name: "Fitness Freaks",
        description: "Everything you need for your fitness journey",
        tags: ["fitness", "gym", "health"],
        Image: "https://example.com/fitness-freaks.png",
        status: ["Active", "Featured"],
        createdAt: "2022-01-20T13:50:00",
        updatedAt: "2022-01-25T19:05:00",
        createdBy: "user3",
        updatedBy: "user4"
      }

    
     
    ];
   
    const table = createTable(readable(data), {
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
        accessor: "categoryId",
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
        header: "Image",
        accessor: "Image",
        cell: ({ value }) => `<img src="${value}" alt="Featured Image" class="h-10 w-10 rounded-full">`,
        plugins: { filter: { exclude: true } }
      }),
    
      table.column({
        header: "Category",
        accessor: "name",
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
        header: "Description",
        accessor: "description",
        cell: ({ value }) => value,
        plugins: { filter: {} }
      }),
      table.column({
        header: "Tags",
        accessor: "tags",
        cell: ({ value }) => value.join(", "),
        plugins: { filter: {} }
      }),
      table.column({
        header: "Status",
        accessor: "status",
        cell: ({ value }) => value.join(", "),
        plugins: { filter: {} }
      }),
    
      table.column({
        header: "Created At",
        accessor: "createdAt",
        cell: ({ value }) => new Date(value).toLocaleDateString(),
        plugins: { sort: {}, filter: { exclude: true } }
      }),
      table.column({
        header: "Updated At",
        accessor: "updatedAt",
        cell: ({ value }) => new Date(value).toLocaleDateString(),
        plugins: { sort: {}, filter: { exclude: true } }
      }),
      table.column({
        header: "Created By",
        accessor: "createdBy",
        cell: ({ value }) => value,
        plugins: { filter: { exclude: true } }
      }),
      table.column({
        header: "Updated By",
        accessor: "updatedBy",
        cell: ({ value }) => value,
        plugins: { filter: { exclude: true } }
      }),
      table.column({
        header: "",
        accessor: ({ categoryId }) => categoryId,
        cell: (item) => {
          return createRender(Actions, { id: item.value });
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
    
    let initialHiddenColumns = [ 'createdAt', 'updatedAt', 'attributes', 'createdBy', 'updatedBy'];

    $: hideForId = Object.fromEntries(ids.map((id) => [id, !initialHiddenColumns.includes(id)]));

    $: $hiddenColumnIds = Object.entries(hideForId)
      .filter(([, hide]) => !hide)
      .map(([id]) => id);
   
    const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
    const { filterValue } = pluginStates.filter;
   
    const { selectedDataIds } = pluginStates.select;
   
    const hideableCols = [ "createdAt", "updatedAt",'description', 'tags', 'createdBy', 'updatedBy'];
  </script>
   
  <div class="w-full">
    <div class="mb-4 flex items-center gap-4">
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