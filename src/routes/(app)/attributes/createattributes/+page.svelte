<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { toast } from "svelte-sonner";

  const dispatch = createEventDispatcher();
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  export let editData: any;
  export let editForm: boolean;

  let id = "";
  let name = "";
  let value = "";

  if (editForm) {
    id = editData.id;
    name = editData.name;
    value = editData.value;
  }

  async function onCreateNewAttribute() {
    try {
      const form = new FormData();

      form.append("name", name);
      form.append("value", value);

      const url = editForm
        ? `/masterdata/attribute/${id}/update_record/`
        : "/masterdata/attribute/create_record/";

      if (editForm) {
        await API.put(url, form);
      } else {
        await API.post(url, form);
      }

      dispatch("newAttribute");

      const action = editForm ? "Attribute Updated" : "Attribute Created";

      toast(`${action} successfully!`);
    } catch (error) {
      const action = editForm ? "Update Attribute" : "Create Attribute";
      console.log(`${action}:`, error);
      toast(`Failed to ${action}`);
    }
  }

  function cancelEditModel() {
    dispatch("cancel");
  }
</script>

<Dialog.Root open={true} onOpenChange={cancelEditModel}>
  <Dialog.Content>
    <Dialog.Header class="font-bold mb-5">
      {#if editForm === false}
        <Dialog.Description>New Attribute</Dialog.Description>
      {:else}
        <Dialog.Description>Update Attribute</Dialog.Description>
      {/if}
    </Dialog.Header>
    <div>
      <Label
        for="name"
        class="block text-sm font-medium leading-6 text-gray-500 mb-2"
        >Name</Label
      >
      <div class="mb-2">
        <Input required type="text" name="name" id="name" bind:value={name} />
      </div>
    </div>
    <div>
      <Label
        for="value"
        class="block text-sm font-medium leading-6 text-gray-500 mb-2"
        >Value</Label
      >
      <div class="mt-2">
        <Input required type="text" name="value" id="value" bind:value />
        <span style="color: #17a2b8;"
          >Kindly Use comma (',') to separate the values</span
        >
      </div>
    </div>
    <Dialog.Footer class="justify-between space-x-2">
      <Button variant="ghost" on:click={cancelEditModel}>Cancel</Button>
      {#if editForm === false}
        <Button type="submit" on:click={() => onCreateNewAttribute()}>
          Save
        </Button>
      {:else}
        <Button on:click={() => onCreateNewAttribute()}>Update</Button>
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
