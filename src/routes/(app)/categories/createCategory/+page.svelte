<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";

  let categoryDetails = {
    name: "",
    description: "",
    handle: "",
    parent_category: 0,
    second_parent_category: 0,
    attribute_group: 0,
  };

  let attributeGroups:any = []
  let selectedAttributeGroup  = {
    name:''
  }

  let categories: any = [{
    id:1,
    name:"Two"
  },{
    id:2,
    name:"Two"
  }
];

  async function fetchCategories() {
    try {
      const res = await API.get("/masterdata/category/");
    } catch (error) {
      console.log("category:fetch-category:", error);
    }
  }

  async function fetchAttributeGroups() {
    try {
      const res = await API.get("/masterdata/attributegroup/");
      attributeGroups = res.data.results
    } catch (error) {
      console.log("category:fetch-attribute-group:", error);
    }
  }

  async function createCategory() {
    try {
      const res = await API.post("/masterdata/category/create_record/", {
        ...categoryDetails,
      });
    } catch (error) {}
  }

  function handleGroupChange(selectedGroup: { value: number }) {
  categoryDetails.attribute_group = selectedGroup.value;
  selectedAttributeGroup = attributeGroups.find((g:any) => g.id == selectedGroup.value)
}

  // Mount
  onMount(async () => {
    await fetchCategories();
    await fetchAttributeGroups();
  });
</script>

<div class="m-3">
  <div
    class="bg-white rounded-md p-4 px-6 border overflow-y-auto"
    style="height: calc(100vh - 58px);"
  >
    <div class="container mx-auto max-w-4xl py-8 px-4">
      <h2 class="text-3xl font-bold mb-6 text-center">Add Category</h2>
      <form
        on:submit|preventDefault={createCategory}
        class="space-y-6 bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4"
      >
        <Input
          bind:value={categoryDetails.name}
          placeholder="Name"
          class="input"
        />
        <Textarea
          bind:value={categoryDetails.description}
          placeholder="Description"
          class="textarea"
        />
        <Input
          bind:value={categoryDetails.handle}
          placeholder="Handle"
          class="input"
        />
        <div class="grid grid-cols-2 gap-4">
          <Input
            type="number"
            bind:value={categoryDetails.parent_category}
            placeholder="Parent Category"
            class="input"
          />
          <Input
            type="number"
            bind:value={categoryDetails.second_parent_category}
            placeholder="Secondary Parent Category"
            class="input"
          />
        </div>
        <!-- Assuming Select component exists and can handle multiple selections -->
        <div>
          <Select.Root>
            <Select.Trigger class="input">{ selectedAttributeGroup.name ? selectedAttributeGroup.name :'Select a Attribute Group' }</Select.Trigger>
            <Select.Content>
              <Select.Group>
                {#each attributeGroups as group}
                <Select.Item value={group.id} label={group.name} on:click={() => handleGroupChange({value: group.id})}>
                  {group.name}
                </Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <Button type="submit" class="btn">Submit</Button>
      </form>
    </div>
  </div>
</div>
