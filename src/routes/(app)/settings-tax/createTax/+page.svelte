<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { createEventDispatcher, onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  const dispatch = createEventDispatcher();

  export let editData: any;
  export let editForm: boolean;
  const taxArray = [
    { value: "0", label: "0" },
    { value: "5", label: "5" },
    { value: "12", label: "12" },
    { value: "18", label: "18" },
    { value: "28", label: "28" },
  ];

  let taxDetails = {
    id: "",
    name: "",
    slab: "",
  };

  if (editForm) {
    taxDetails = editData;
  }

  async function createTax() {
    try {
      const form = new FormData();

      form.append("name", taxDetails.name);
      form.append("slab", taxDetails.slab);

      const url = editForm
        ? `/inventory/tax/${taxDetails.id}/update_record/`
        : "/inventory/tax/create_record/";

      if (editForm) {
        await API.put(url, form);
      } else {
        await API.post(url, form);
      }

      dispatch("newTax");
      const action = editForm ? "Tax Updated" : "Tax Created";
      toast(`${action} successfully!`);
    } catch (error) {
      const action = editForm ? "Update tax" : "Create tax";
      console.log(`${action}:`, error);
      toast(`Failed to ${action}`);
    }
  }

  function cancelDelete() {
    dispatch("cancel");
  }

  function handleBrandChange(selectedVariantId: string) {
    taxDetails.slab = selectedVariantId;
  }
</script>


<Dialog.Root open={true} onOpenChange={cancelDelete}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header class="font-bold mb-5">
      <Dialog.Description
        >{editForm ? "Update Tax" : "New Tax"}</Dialog.Description
      >
    </Dialog.Header>
    <div class="mb-3">
      <Label for="name">Name</Label>
      <Input
        id="name"
        bind:value={taxDetails.name}
        placeholder="Name"
        class="input"
      />
    </div>
    <div class="grid gap-2">
      <Label for="security-level">Variant</Label>
      <Select.Root>
        <Select.Trigger class="input capitalize">
          {taxDetails.slab ? taxDetails.slab : "Select Slab Rate"}
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            {#each taxArray as slab}
              <Select.Item
                value={slab.value}
                label={slab.label}
                class="capitalize card"
                on:click={() => handleBrandChange(slab.value)}
              >
                {slab.label}
              </Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
    <Dialog.Footer class="justify-between space-x-2">
      <Button type="button" variant="ghost" on:click={cancelDelete}
        >Cancel</Button
      >
      <Button type="submit" on:click={createTax}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
