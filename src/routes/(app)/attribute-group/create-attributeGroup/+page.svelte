<script lang="ts">
    import {onMount} from "svelte";
    import {createEventDispatcher} from "svelte";
    import {toast} from "svelte-sonner";
    import * as Select from "$lib/components/ui/select";

    const dispatch = createEventDispatcher();
    import API from "$lib/services/api";
    import {Button} from "$lib/components/ui/button"

    export let editData;
    export let editForm;

    let id = "";
    let name = "";
    let attributes: number[] = [];

    let attribute: any[] = [];
    let selectedAttributes: number[] = [];
    let selectedAttributeNames: string[] = [];

    if (editForm) {
        id = editData.id
        name = editData.name
        attributes = editData.attributes;
        selectedAttributes = attributes;
        updateSelectedAttributeNames()
    }

    async function updateSelectedAttributeNames() {
        if(!attribute.length) await fetchAttribute()
        selectedAttributeNames = attribute.filter(attr => selectedAttributes.includes(attr.id)).map(attr => attr.name);
        console.log("att", selectedAttributeNames, attribute, selectedAttributes)
    }

    async function fetchAttribute() {
        try {
            const res = await API.get("/masterdata/attribute/");
            attribute = res.data.results;
            console.log('attribute:>>:', attribute)
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
            const formData = {
                name: name,
                attributes: attributes,
            };

            const url = editForm
                ? `/masterdata/attributegroup/${id}/update_record/`
                : "/masterdata/attributegroup/create_record/";

            if (editForm) {
                await API.put(url, formData);
            } else {
                await API.post(url, formData);
            }

            dispatch("newAttributeGroup");

            const action = editForm ? "Attribute Group Updated" : "Attribute Group Created";

            toast(`${action} successfully!`);
        } catch (error) {
            const action = editForm ? "Update Attribute Group" : "Create Attribute Group";
            console.log(`${action}:`, error);
            toast(`Failed to ${action}`);
        }
    }

    onMount(async () => {
        await fetchAttribute();
    });
</script>

<div class="fixed bg-background inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
    <div class="bg-white p-6 rounded-lg">
        <!--        <div class="flex items-center justify-between mb-2">-->
        <header class="font-bold mb-5" style="color: black">
            {#if editForm === false}
                <h1>New Attribute Group</h1>
            {:else}
                <h1>Update Attribute Group</h1>
            {/if}
        </header>
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
                <div class="mt-2">
                    <Select.Root>
                        <Select.Trigger class="input capitalize"
                        >{selectedAttributeNames
                            ? selectedAttributeNames
                            : "Select a Attributes"}</Select.Trigger
                        >
                        <Select.Content>
                            <Select.Group>
                                {#each attribute as a}
                                    <Select.Item
                                            value={a.id}
                                            label={a.name}
                                            class="capitalize"
                                            on:click={() => handleAttributeChange({ value: a.id })}
                                    >
                                        {a.name}
                                    </Select.Item>
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </div>
            </div>
        </main>

        <footer class="flex mt-5">
            {#if editForm === false}
                <Button type=submit
                        class="text-xs flex items-center gap-2 border border-blue-500 bg-blue-500 text-white px-4 py-1.5 rounded"
                        on:click={() =>onCreateNewAttribute()}
                >Create Attribute Group
                </Button>

            {:else}

                <Button class="text-xs flex items-center gap-2 border border-blue-500 bg-blue-500 text-white px-4 py-1.5 rounded"
                        on:click={() =>onCreateNewAttribute()}
                >Update Attribute Group
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
