<script>
  import { createEventDispatcher } from "svelte";
  import API from "../../services/api";
  import ReusableButton from "../Reusable/Button.svelte";
  const dispatch = createEventDispatcher();
  let name = "";
  let description = "";

  async function createBrand() {
    try {
      await API.post("/masterdata/brand/create_record/", {
        name,
        description,
      });
    } catch (error) {
      console.log("create:brand:", error);
    }
    dispatch("newBrand");
  }
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <h4>New Brand</h4>
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

  <div class="w-1/2">
    <label
      for="first-name"
      class="block text-sm font-medium leading-6 text-gray-500"
      >Description</label
    >
    <div class="mt-2">
      <textarea
        name="description"
        bind:value={description}
        id=""
        cols="30"
        rows="5"
        class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
      ></textarea>
    </div>
  </div>
  <div class="w-1/2 flex items-center gap-4">
    <div class="block text-sm font-medium leading-6 text-gray-500">Logo</div>
    <button
      class="text-xs flex items-center gap-2 border border-blue-500 bg-blue-500 text-white px-4 py-1.5 rounded"
      >Uploads Logo</button
    >
  </div>
  <div>
    <ReusableButton label={"Create Attribute group"} on:click={createBrand} />
  </div>
</div>
