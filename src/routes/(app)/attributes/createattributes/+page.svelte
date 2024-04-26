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
  let validation: any = {};

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
      validation = {};

      if (name == "") {
        validation.name = ["This field may not be blank."];
      }

      if (value == "") {
        validation.value = ["This field may not be blank."];
      }

      const form = new FormData();

      form.append("name", name);
      form.append("value", value);

      const url = editForm
        ? `/masterdata/attribute/${id}/update_record/`
        : "/masterdata/attribute/create_record/";

      if (validation.name || validation.value) {
        toast(`Please fill the required field`);
      } else {
        if (editForm) {
          await API.put(url, form);
        } else {
          await API.post(url, form);
        }

        dispatch("newAttribute");

        const action = editForm ? "Attribute Updated" : "Attribute Created";

        toast(`${action} successfully!`);
      }
    } catch (error: any) {
      const action = editForm ? "Update Attribute" : "Create Attribute";
      console.log(`${action}:`, error);
      validation = error.response.data;
      toast(`Failed to ${action}`);
    }
  }

  function cancelEditModel() {
    dispatch("cancel");
  }
</script>

<Dialog.Root open={true} onOpenChange={cancelEditModel}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header class="font-bold mb-5">
      {#if editForm === false}
        <Dialog.Title>New Attribute</Dialog.Title>
      {:else}
        <Dialog.Title>Update Attribute</Dialog.Title>
      {/if}
    </Dialog.Header>
    <div class="grid gap-2">
      <Label
        for="name"
        class="block text-sm font-medium leading-6"
        >Name</Label
      >
      <div class="mb-2 ">
        <Input required type="text" name="name" id="name" bind:value={name} class="{validation.name ? 'border-red-500' : ''}"/>
        <p class="text-red-500">{validation.name ? validation.name : ""}</p>
      </div>
    </div>
    <div class="grid gap-2">
      <Label
        for="value"
        class="block text-sm font-medium leading-6"
        >Value</Label
      >
      <div>
        <Input required type="text" name="value" id="value" bind:value class="{validation.value ? 'border-red-500' : ''}"/>
        <p class="text-red-500">{validation.value ? validation.value : ""}</p>
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
