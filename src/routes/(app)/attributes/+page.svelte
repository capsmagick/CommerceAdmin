<script lang="ts">
    /** @type {import('./$types').PageData} */
    import {onMount} from "svelte";
    import CreateAttribute from "./createattributes/+page.svelte";
    import API from "$lib/services/api";
    import AttributeTable from "./attributeTable.svelte";
    interface Attribute {
    id: number;
    name: string; 
    // Add other properties of an attribute here if needed
    }

    let showDeleteModal = false;
    let deletingAttribute:Attribute;

    let attributes: any[] = [];
    let editData: any = null;
    let showForm: boolean = false;
    let editForm: boolean = false;

    function toggleForm() {
        console.log(showForm)
        showForm = !showForm
    }


    // Ensure this is initialized as an array

    async function getAttributes() {
        try {
            const res = await API.get("/masterdata/attribute/");
            // Ensure attributes is always an array, even if res.data or res.data.results is undefined
            attributes = Array.isArray(res.data?.results) ? res.data.results : [];
        } catch (error) {
            console.error("Error fetching attributes:", error);
            attributes = []; // Ensure attributes is reset to an empty array in case of an error
        }
    }

    onMount(async () => {
        await getAttributes();
    });
</script>

<div class="m-3">
    {#if showForm}
        <CreateAttribute
                on:close={() => {
                editData = null;
                editForm = false;
                showForm = false;
                }}
                on:newAttribute={() => {
                editData = null;
                editForm = false;
                showForm = false;
                getAttributes();
            }}
                {editData}
                {editForm}
        />
    {/if}

    <div class="bg-white rounded-md p-4 px-6 border overflow-y-auto">
        <div>
            <div class="flex items-center justify-between">
                <h4 class="text-lg font-medium text-gray-800">Attributes</h4>
                <div class="flex items-center gap-2">
                    <button
                            class="text-xs flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-1.5 rounded"
                            on:click={() => toggleForm()}
                    >
              <span>
                <i class="fa-solid fa-plus text-sm"></i>
              </span>New Attribute
                    </button
                    >
                </div>
            </div>
        </div>
        <div class="mt-8 flow-root" > <AttributeTable /></div>
    </div>
   
</div>
