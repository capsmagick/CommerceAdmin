<script>
  /** @type {import('./$types').PageData} */
  import { onMount } from "svelte";
  import API from "../../services/api";
  import CreateCategories from "../../components/Categories/CreateCategories.svelte";

  //
  export let data;
  let categories = [];
  let showForm = false;

  //
  async function fetchCategories() {
    try {
      const res = await API.get("/masterdata/category/");
      categories = res.results;
    } catch (error) {
      console.log("fetch:categories:", error);
    }
  }
  async function onDeleteCategory(category) {
    try {
      await API.delete(`/masterdata/category/${category.id}/delete_record/`);
    } catch (error) {
      console.log("delete:category:", error);
    }
  }

  //   Mount
  onMount(async () => {
    await fetchCategories();
  });
</script>

<div class="m-3">
  <div
    class="bg-white rounded-md p-4 px-6 border overflow-y-auto"
    style="height: calc(100vh - 58px);"
  >
    {#if !showForm}
      <div>
        <div class="flex items-center justify-between">
          <h4 class="text-lg font-medium text-gray-800">Categories</h4>
          <div class="flex items-center gap-2">
            <button
              class="text-xs flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-1.5 rounded"
              on:click={() => (showForm = true)}
            >
              <span>
                <i class="fa-solid fa-plus text-sm"></i>
              </span>New Category</button
            >
          </div>
        </div>
      </div>
      <!-- table -->
      <div class="mt-8 flow-root">
        <div class=" overflow-x-auto">
          <div
            class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
          >
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >Name</th
                  >
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >Handle</th
                  >
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >Description</th
                  >
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >Actions</th
                  >
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {#each categories as category, i}
                  <tr>
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                      >{category.name}</td
                    >
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      >{category.handle}</td
                    >
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      >{category.description}</td
                    >
                    <td
                      class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex gap-2 items-center"
                    >
                      <button class="text-gray-700" on>
                        <i class="fa-solid fa-pencil"></i>
                      </button>
                      <button
                        class="text-red-500"
                        on:click={onDeleteCategory(category)}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    {:else}
      <CreateCategories
        on:close={() => (showForm = false)}
        on:newCategory={() => {
          showForm = false;
          fetchCategories();
        }}
      />
    {/if}
  </div>
</div>
