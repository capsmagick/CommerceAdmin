<script lang="ts">
      import { Button } from "$lib/components/ui/button";
  import { createEventDispatcher, onMount } from "svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import API from "$lib/services/api";
  import { cn } from "$lib/utils.js";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import Check from "lucide-svelte/icons/check";
  import CaretSort from "svelte-radix/CaretSort.svelte";
  import { Label } from "$lib/components/ui/label";
  import { toast } from "svelte-sonner";





  const dispatch = createEventDispatcher();

    let id = "";
    let productId:any;
    export let editData: any;
    let collections:any = [];
    let collectionOptions: { id: string; value: string; label: string }[] = [];
    let collectionId:any;
    let open: boolean = false;

    if(editData){
        productId = editData.id        
    }
  function cancelModel() {
    dispatch("cancel");
  }

  async function getCollection() {
    try {
      const response = await API.get("/products/collection/");
      collections = response.data.results;

      collectionOptions = collections.map((i: any) => ({
        id: i.id,
        value: i.name,
        label: i.name,
      }));      
    } catch (error) {
      console.error("fetch:collection:", error);
      return [];
    }
  }

  function addToCollection() {
    try{
      const formData = new FormData();
      formData.append("product", productId);

        API.post(`/products/collection/${collectionId}/add-product/`, formData)
        dispatch("addToCollection");
        toast(`Product Added to Collection`)
    }
    catch(error:any){
        console.error("Add to:Collection:", error);
    }
  }

  onMount(async()=>{
    await getCollection()
  })

    $: selectedParentCategory =
    collectionOptions.find((f) => f.value === id)?.label ??
    "Select Collection";

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<Dialog.Root open={true} onOpenChange={cancelModel} preventScroll={true}>
  <Dialog.Content>
        <Dialog.Title> Add To Collection</Dialog.Title>
    <div class="flex justify-center">
         <div class="grid gap-3">
          <Label for="collection">Collection</Label>

          <Popover.Root bind:open let:ids>
            <Popover.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                class="w-[200px] justify-between"
              >
                {selectedParentCategory}
                <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </Popover.Trigger>
            <Popover.Content class="w-[200px] p-0">
              <Command.Root>
                <Command.Input placeholder="Search category..." class="h-9" />
                <Command.Empty>No category found.</Command.Empty>
                <Command.Group>
                  {#each collectionOptions as category}
                    <Command.Item
                      value={category.value}
                      onSelect={(currentValue) => {
                        id = currentValue;
                        closeAndFocusTrigger(ids.trigger);
                        collectionId = category.id;
                      }}
                    >
                      <Check
                        class={cn(
                          "mr-2 h-4 w-4",
                          id !== category.id && "text-transparent"
                        )}
                      />
                      {category.label}
                    </Command.Item>
                  {/each}
                </Command.Group>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>
        </div>

    </div>
    <Dialog.Footer class="justify-between space-x-2">
      <Button variant="ghost" on:click={() => cancelModel()}>Cancel</Button>
      <Button on:click={() => addToCollection()}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>