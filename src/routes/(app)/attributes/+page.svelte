<script lang="ts">
    /** @type {import('./$types').PageData} */
    import {onMount} from "svelte";
    import CreateAttribute from "./createattributes/+page.svelte";
    import API from "$lib/services/api";
    import { Button } from "$lib/components/ui/button";
    import AttributeTable from "./attributeTable.svelte";

  import * as Sheet from "$lib/components/ui/sheet/index";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";


    let attributes: any[] = [];
    let editData: any = null;
    let showForm: boolean = false;
    let editForm: boolean = false;

    function toggleForm() {
        console.log(showForm)
        showForm = !showForm
    }


    // Ensure this is initialized as an array

    async function getAttributes() {
        try {
            const res = await API.get("/masterdata/attribute/");
            // Ensure attributes is always an array, even if res.data or res.data.results is undefined
            attributes = Array.isArray(res.data?.results) ? res.data.results : [];
        } catch (error) {
            console.error("Error fetching attributes:", error);
            attributes = []; // Ensure attributes is reset to an empty array in case of an error
        }
    }

    onMount(async () => {
        await getAttributes();
    });
</script>

<div class="m-3">
    {#if showForm}
        <CreateAttribute
                on:close={() => {
                editData = null;
                editForm = false;
                showForm = false;
                }}
                on:newAttribute={() => {
                editData = null;
                editForm = false;
                showForm = false;
                getAttributes();
            }}
                {editData}
                {editForm}
        />
    {/if}
</div>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center ">
      <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 flex-1">Attributes</h4>
        <Button class="text-xs flex items-center gap-2 border  px-4 py-1.5" on:click={() => toggleForm()}>
            <span>
                <i class="fa-solid fa-plus text-sm"></i>
            </span>New Attribute
        </Button>
        <Sheet.Root>
            <Sheet.Trigger asChild let:builder>
              <Button builders={[builder]} variant="outline">Add New</Button>
            </Sheet.Trigger>
            <Sheet.Content side="right">
              <Sheet.Header>
                <Sheet.Title>Add Attribute</Sheet.Title>
                <Sheet.Description>
                  create new attributes here. Add multiple value seprated by comma.Click save when you're done.
                </Sheet.Description>
              </Sheet.Header>
              <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="name" class="text-right">Name</Label>
                  <Input id="name" value="Pedro Duarte" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="values" class="text-right">Values</Label>
                  <Input id="values" value="@peduarte" class="col-span-3" />
                </div>
              </div>
              <Sheet.Footer>
                <Sheet.Close asChild let:builder>
                  <Button builders={[builder]} type="submit">Save changes</Button>
                </Sheet.Close>
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet.Root>
  </div>
  <AttributeTable />
  
</div>