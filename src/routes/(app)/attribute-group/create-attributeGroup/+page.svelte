<script lang="ts">
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { toast } from "svelte-sonner";
  import * as Select from "$lib/components/ui/select";

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
  let attributes: number[] = [];

  let attribute: any[] = [];
  let selectedAttributes: number[] = [];
  let selectedAttributeNames: string[] = [];
  let validation: any = {};

  if (editForm) {
    id = editData.id;
    name = editData.name;
    attributes = editData.attributes;
    selectedAttributes = attributes.map(i=>i.id);
    updateSelectedAttributeNames();
  }

  async function updateSelectedAttributeNames() {
    if (!attribute.length) await fetchAttribute();
    selectedAttributeNames = attribute
      .filter((attr) => selectedAttributes.includes(attr.id))
      .map((attr) => attr.name);
  }

  async function fetchAttribute() {
    try {
      const res = await API.get("/masterdata/attribute/");
      attribute = res.data.results;
    } catch (error) {
      console.log("category:fetch-attribute-group:", error);
    }
  }

  // function handleAttributeChange(selectedAttribute: { value: number }) {
  //     attributes = selectedAttribute.value;
  //     selectedAttribute = attribute.find(
  //         (g: any) => g.id == selectedAttribute.value
  //     ).name;
  // }

  function handleAttributeChange(selectedAttribute: { value: number }) {
    const index = selectedAttributes.indexOf(selectedAttribute.value);
    if (index === -1) {
      selectedAttributes = [...selectedAttributes, selectedAttribute.value];
    } else {
      selectedAttributes.splice(index, 1);
    }
    attributes = selectedAttributes;
    updateSelectedAttributeNames();
  }

  async function onCreateNewAttribute() {
    try {
      validation = {};

      if (name == "") {
        validation.name = ["This field may not be blank."];
      }

      if (attributes.length == 0) {
        validation.attributes = ["This field may not be blank."];
      }

      const formData = {
        name: name,
        attributes: attributes,
      };

      const url = editForm
        ? `/masterdata/attributegroup/${id}/update_record/`
        : "/masterdata/attributegroup/create_record/";

      if (validation.name || validation.attributes) {
        toast(`Please fill the required field`);
        console.log(validation);
      } else {
        if (editForm) {
          await API.put(url, formData);
        } else {
          await API.post(url, formData);
        }

        dispatch("newAttributeGroup");

        const action = editForm
          ? "Attribute Group Updated"
          : "Attribute Group Created";

        toast(`${action} successfully!`);
      }
    } catch (error: any) {
      const action = editForm
        ? "Update Attribute Group"
        : "Create Attribute Group";
      console.log(`${action}:`, error);
      validation = error.response.data;
      toast(`Failed to ${action}`);
    }
  }

  onMount(async () => {
    await fetchAttribute();
  });

  function cancelEditModel() {
    dispatch("cancel");
  }
</script>

<Dialog.Root open={true} onOpenChange={cancelEditModel}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header class="font-bold mb-5">
      {#if editForm === false}
        <Dialog.Description>New Attribute Group</Dialog.Description>
      {:else}
        <Dialog.Description>Update Attribute Group</Dialog.Description>
      {/if}
    </Dialog.Header>
    <div>
      <Label for="name">Name</Label>
      <div class="mb-2">
        <Input
          required
          type="text"
          name="name"
          id="name"
          bind:value={name}
          class={validation.name ? "border-red-500" : ""}
        />
        <p class="text-red-500">{validation.name ? validation.name : ""}</p>
      </div>
    </div>
    <div>
      <div class="mt-2">
        <Select.Root>
          <Select.Trigger
            class="input capitalize {validation.attributes
              ? 'border-red-500'
              : ''}"
          >
            {selectedAttributeNames
              ? selectedAttributeNames
              : "Select a Attributes"}</Select.Trigger
          >
          <Select.Content>
            <Select.Group>
              {#each attribute as a}
                <Select.Item
                  value={a.id}
                  label={a.name}
                  class="capitalize card"
                  on:click={() => handleAttributeChange({ value: a.id })}
                >
                  {a.name}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
      <p class="text-red-500">{validation.attributes ? validation.name : ""}</p>
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
