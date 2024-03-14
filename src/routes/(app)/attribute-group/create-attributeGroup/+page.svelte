<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import API from "$lib/services/api";
  import ReusableButton from "../../../../components/Reusable/Button.svelte";
  const dispatch = createEventDispatcher();
  let name = "";

  async function createAttributeGroup() {
    try {
      const res = await API.post("/masterdata/attributegroup/create_record/", {
        name,
      });

      dispatch("newAttributeGroup")
    } catch (error) {
      console.log("create:attributegroup:", error);
    }
  }
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <h4>New Attribute</h4>
    <button on:click={() => dispatch("close")}>
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
  <div class="w-1/2">
    <label
      for="first-name"
      class="block text-sm font-medium leading-6 text-gray-500">Name</label
    >
    <div class="mt-2">
      <input
        type="text"
        name="first-name"
        id="first-name"
        class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
        bind:value={name}
      />
    </div>
  </div>
  <div>
    <ReusableButton
      label={"Create Attribute group"}
      on:click={createAttributeGroup}
    />
  </div>
</div>
