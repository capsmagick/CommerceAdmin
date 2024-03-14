<script lang="ts">
  import { onMount} from "svelte"
  import API from "$lib/services/api";
    import CreateAttributeGroup from '../attributes/createattributes/+page.svelte';
    export let data;
    let showForm = false
    let attributesGroup: { id: number; name: string }[] = []

    async function fetchAttributeGroups(){
      try {
        const res = await API.get("/masterdata/attributegroup/")
        attributesGroup = res.data.results || []
      } catch (error) {
        console.log("fetch:attributegroup:", error)
      }
    }
    async function deleteAttributeGroup(group: { id: number }): Promise<void> {
      try {
        await API.delete(`/masterdata/attributegroup/${group.id}/delete_record/`)
        await fetchAttributeGroups()
      } catch (error) {
        console.log("delete:attributegroup:", error)
      }
    }
    // Mount
    onMount(async () => {
      await fetchAttributeGroups()
    } )
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
                  {#each attributesGroup as attribute, i}
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
                        <button class="text-red-500" on:click={() => deleteAttributeGroup(attribute)}>
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
        <CreateAttributeGroup
          on:close={() => (showForm = false)}
          on:newAttributeGroup={() => {
            showForm = false;
            fetchAttributeGroups
          }}
        />
      {/if}
    </div>
  </div>