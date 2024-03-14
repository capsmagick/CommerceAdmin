<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import { toast } from "svelte-sonner";

    const dispatch = createEventDispatcher();
    import API from "$lib/services/api";
    import {Button }from "$lib/components/ui/button"

    export let editData;
    export let editForm;

    let id = "";
    let name = "";
    let value = "";

    if (editForm) {
        id = editData.id
        name = editData.name
        value = editData.value
    }

    async function onCreateNewAttribute() {
        try {
            const formData = {
                name,
                value: [value.replace(/\s/g, '')]
            };

            const url = editForm
                ? `/masterdata/attribute/${id}/update_record/`
                : "/masterdata/attribute/create_record/";

            if (editForm) {
                await API.put(url, formData);
            } else {
                await API.post(url, formData);
            }

            dispatch("newAttribute");

            const action = editForm ? "Attribute Updated" : "Attribute Created";

            toast(`${action} successfully!`);
        } catch (error) {
            const action = editForm ? "Update Attribute" : "Create Attribute";
            console.log(`${action}:`, error);
            toast(`Failed to ${action}`);
        }
    }
</script>

<div class="fixed inset-0 flex bg-gray-500 bg-opacity-50 justify-end" style="z-index: 1">
    <div class="bg-white p-6 rounded-lg">
        <!--        <div class="flex items-center justify-between mb-2">-->
        <header class="font-bold mb-5" style="color: black">
            {#if editForm === false}
                <h1>New Attribute</h1>
            {:else}
                <h1>Update Attribute</h1>
            {/if}
            <!--            <button on:click={() => dispatch("close")}>-->
            <!--                <i class="fa-solid fa-xmark"></i>-->
            <!--            </button>-->
        </header>
        <!--        </div>-->
        <!--        <div class="w-1/2">-->
        <main>

            <div>
                <label
                        for="name"
                        class="block text-sm font-medium leading-6 text-gray-500 mb-2">Name</label
                >
                <div class="mb-2">
                    <input required
                           type="text"
                           name="name"
                           id="name"
                           class="mb-2 block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                           bind:value={name}
                    />
                </div>
            </div>
            <div>
                <label
                        for="value"
                        class="block text-sm font-medium leading-6 text-gray-500 mb-2">Value</label
                >
                <div class="mt-2">
                    <input required
                           type="text"
                           name="value"
                           id="value"
                           class="block mb-2
                     w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                           bind:value={value}
                    />
                    <span style="color: #17a2b8;">Kindly Use comma (',') to separate the values</span>
                </div>
            </div>
        </main>

        <footer class="flex mt-5">
            {#if editForm === false}
                <Button type=submit  class="text-xs flex items-center gap-2 border border-blue-500 bg-blue-500 text-white px-4 py-1.5 rounded"
                        on:click={() =>onCreateNewAttribute()}
                >Create Attribute
                </Button>

            {:else}

                <Button class="text-xs flex items-center gap-2 border border-blue-500 bg-blue-500 text-white px-4 py-1.5 rounded"
                        on:click={() =>onCreateNewAttribute()}
                >Update Attribute
                </Button>
            {/if}

            <Button class="text-xs
                                ml-2
                               flex items-center gap-2
                               border border-red-500 bg-red-500 text-white px-4 py-1.5 rounded"
                    on:click={() => dispatch("close")}
            >Cancel
            </Button>
        </footer>
    </div>

</div>
