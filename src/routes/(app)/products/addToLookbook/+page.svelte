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
  let productId: any;
  export let editData: any;
  let lookbook: any = [];
  let lookbookOptions: { id: string; value: string; label: string }[] = [];
  let lookbookId: any;
  let open: boolean = false;
  let validation: any = {};

  if (editData) {
    productId = editData.id;
  }
  function cancelModel() {
    dispatch("cancel");
  }

  async function getLookbook() {
    try {
      const response = await API.get("/products/look-book/");
      lookbook = response.data.results;

      lookbookOptions = lookbook.map((i: any) => ({
        id: i.id,
        value: i.name,
        label: i.name,
      }));
    } catch (error) {
      console.error("fetch:Lookbook:", error);
      return [];
    }
  }

  async function addToLookbook() {
    try {
      validation = {};

      if (!lookbookId) {
        validation.lookbookId = ["This field may not be blank."];
      }

      if (validation.lookbookId) {
        toast(`Please fill the required field`);
      } else {
        const formData = new FormData();
        formData.append("look_book", lookbookId);

        await API.post(
          `/products/product/${productId}/add-to-lookbook/`,
          formData
        );
        dispatch("addToLookbook");
        toast(`Product Added to Lookbook`);
      }
    } catch (error: any) {
      console.error("Add to:Lookbook:", error);
      validation = error.response.data;
      toast(`Failed to add Lookbook`);

    }
  }

  onMount(async () => {
    await getLookbook();
  });

  $: selectedParentCategory =
    lookbookOptions.find((f) => f.value === id)?.label ?? "Select Lookbook";

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<Dialog.Root open={true} onOpenChange={cancelModel} preventScroll={true}>
  <Dialog.Content>
    <Dialog.Title>Add To Lookbook</Dialog.Title>
    <div class="flex justify-center">
      <div class="grid gap-3">
        <Label for="Lookbook">Lookbook</Label>

        <Popover.Root bind:open let:ids>
          <Popover.Trigger asChild let:builder>
            <Button
              builders={[builder]}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              class="w-[200px] justify-between {validation.lookbookId ? 'border-red-500' : ''}"
            >
              {selectedParentCategory}
              <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </Popover.Trigger>
          <Popover.Content class="w-[200px] p-0">
            <Command.Root>
              <Command.Input placeholder="Search lookbook..." class="h-9" />
              <Command.Empty>No lookbook found.</Command.Empty>
              <Command.Group>
                {#each lookbookOptions as lookbook}
                  <Command.Item
                    value={lookbook.value}
                    onSelect={(currentValue) => {
                      id = currentValue;
                      closeAndFocusTrigger(ids.trigger);
                      lookbookId = lookbook.id;
                    }}
                  >
                    <Check
                      class={cn(
                        "mr-2 h-4 w-4",
                        id !== lookbook.id && "text-transparent"
                      )}
                    />
                    {lookbook.label}
                  </Command.Item>
                {/each}
              </Command.Group>
            </Command.Root>
          </Popover.Content>
        </Popover.Root>
        <p class="text-red-500">{validation.lookbookId ? validation.lookbookId : ""}</p>
      </div>
    </div>
    <Dialog.Footer class="justify-between space-x-2">
      <Button variant="ghost" on:click={() => cancelModel()}>Cancel</Button>
      <Button on:click={() => addToLookbook()}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
