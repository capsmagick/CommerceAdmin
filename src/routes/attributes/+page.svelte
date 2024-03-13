<script lang="ts">
  /** @type {import('./$types').PageData} */
  import { onMount } from "svelte";
  import CreateAttribute from "../../components/attributes/CreateAttribute.svelte";
  import Api from "../../services/api";

  type Attribute = {
    id: number;
    name: string;
  };

  let attributes: Attribute[] = [];
  let showForm = false;
  async function getAttributes() {
    try {
      const res = await Api.get("/masterdata/attribute/")
      attributes = res.results;
    } catch (error) {}
  }
  // Edit Attribute
  async function onEditAttribute(attribute: { id: number }) {}
  // Delete Attribute
  async function onDeleteAttribute(attribute: { id: number }) {
    try {
      const res = await Api.delete(`/masterdata/attribute/${attribute.id}/delete_record/`)
      await getAttributes();
    } catch (error) {}
  }
  onMount(async () => {
    await getAttributes();
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
          <h4 class="text-lg font-medium text-gray-800">Attributes</h4>
          <div class="flex items-center gap-2">
            <button
              class="text-xs flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-1.5 rounded"
              on:click={() => (showForm = true)}
            >
              <span>
                <i class="fa-solid fa-plus text-sm"></i>
              </span>New Attribute</button
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
                    class="relative py-3.5 pl-3 pr-4 sm:pr-0 flex"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {#each attributes as attribute, i}
                  <tr>
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                      >{attribute.name}</td
                    >
                    <td
                      class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex gap-2 items-center"
                    >
                      <button class="text-gray-700">
                        <i class="fa-solid fa-pencil"></i>
                      </button>
                      <button
                        class="text-red-500"
                        on:click={() => onDeleteAttribute(attribute)}
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
      <CreateAttribute
        on:close={() => (showForm = false)}
        on:newAttribute={() => {
          showForm = false;
          getAttributes;
        }}
      />
    {/if}
  </div>
</div>
