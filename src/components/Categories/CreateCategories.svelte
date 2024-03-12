<script>
  import { createEventDispatcher } from "svelte";
  import ReusableButton from "../Reusable/Button.svelte";
  const dispatch = createEventDispatcher();
  let name = "";
  let description = "";
  let handle = "";

  function createCategory() {
    dispatch("newCategory");
  }
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <h4>New Category</h4>
    <button on:click={() => dispatch("close")}>
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>

  <!-- Text input -->
  <div class="w-1/2 flex flex-col gap-2">
    <div class="mb-4 w-full">
      <label for="5a4c38e0-9cd0-43cf-8879-1e8d91db32df" class="text-sm text-gray-500">Name</label>
      <input
        placeholder="Enter category name"
        type="text"
        id="5a4c38e0-9cd0-43cf-8879-1e8d91db32df"
        class="w-full mt-1 block rounded-lg border dark:border-none dark:bg-neutral-600 py-[9px] px-3 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
      />
    </div>

    <!-- Text input -->
    <div class="mb-4 w-full">
      <label for="dfa7f83c-a3fb-47af-82f5-ad6067f59e3d" class="text-sm text-gray-500">Handle</label>
      <input
        placeholder="/tshirts"
        type="text"
        id="dfa7f83c-a3fb-47af-82f5-ad6067f59e3d"
        class="w-full block mt-1 rounded-lg border dark:border-none dark:bg-neutral-600 py-[9px] px-3 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
      />
    </div>

    <!-- Textarea -->
    <div class="mb-4 w-full">
      <label for="a9af331c-62c8-4809-a02b-8c52676d0d65" class="text-sm text-gray-500">Description</label>
      <textarea
        placeholder="Description"
        type="password"
        id="a9af331c-62c8-4809-a02b-8c52676d0d65"
        rows="4"
        class="w-full block rounded-lg border dark:border-none dark:bg-neutral-600 py-[9px] px-3 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
      ></textarea>
    </div>
  </div>
  <div>
    <ReusableButton label={"Create Category"} on:click={createCategory} />
  </div>
</div>
