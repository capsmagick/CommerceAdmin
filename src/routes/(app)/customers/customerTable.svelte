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
    import { readable } from "svelte/store";
    import * as Table from "$lib/components/ui/table/index.js";
    import Actions from "./customerTableActions.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { cn } from "$lib/utils.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import DataTableCheckbox from "./customerTableCheckbox.svelte";
   
    type Payment = {
      id: string;
      name: string;
      status: "Pending" | "Processing" | "Success" | "Failed";
      email: string;
      phoneNumber: number;
      shippingAddress: string;
    };
   
    const data: Payment[] = [
      {
        id: "m5gr84i9",
        name: 'Arun',
        status: "Success",
        email: "arun@yahoo.com",
        phoneNumber: 9876543210,
        shippingAddress: '123, ABC Street, New York, USA'
      },
      {
        id: "3u1reuv4",
        name: 'Amal',
        status: "Success",
        email: "amal@yahoo.com",
        phoneNumber: 9876543210,
        shippingAddress: '123, ABC Street, New York, USA'
      },
      {
        id: "derv1ws0",
        name: 'Abhi',
        status: "Success",
        email: "abhi@yahoo.com",
        phoneNumber: 9876543210,
        shippingAddress: '123, ABC Street, New York, USA'
      },
      {
        id: "5kma53ae",
        name: 'Babu',
        status: "Success",
        email: "babu@yahoo.com",
        phoneNumber: 9876543210,
        shippingAddress: '123, ABC Street, New York, USA'
      },
      {
        id: "bhqecj4p",
        name: 'Kumar',
        status: "Success",
        email: "kumar@yahoo.com",
        phoneNumber: 9876543210,
        shippingAddress: '123, ABC Street, New York, USA'
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
        header: "Name",
        accessor: "name",
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
        accessor: "phoneNumber",
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
      table.column({
        header: "",
        accessor: ({ id }) => id,
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
   
    $: $hiddenColumnIds = Object.entries(hideForId)
      .filter(([, hide]) => !hide)
      .map(([id]) => id);
   
    const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
    const { filterValue } = pluginStates.filter;
   
    const { selectedDataIds } = pluginStates.select;
   
    const hideableCols = ["status", "email", "phoneNumber", "shippingAddress"];
  </script>
   
  <div class="w-full">
    <div class="mb-4 flex items-center gap-4">
      <Input
        class="max-w-sm"
        placeholder="Filter emails..."
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