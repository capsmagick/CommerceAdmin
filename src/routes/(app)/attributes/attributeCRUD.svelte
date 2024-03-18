<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet/index";
    import {Button} from "$lib/components/ui/button";
    import {Input} from "$lib/components/ui/input";
    import {Label} from "$lib/components/ui/label";
    import {refreshtable} from '$lib/Functions/CRUD';
    import API from "$lib/services/api";
    import {toast} from "svelte-sonner";
    import {onMount, setContext} from 'svelte';
    import {writable} from 'svelte/store';

    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    let id = "";
    let name = "";
    let value = "";

    export let editData;
    export let editForm;

    const editDataStore = writable(editData);

    function handleEditDataChange(newValue) {
        id = newValue.id;
        name = newValue.name;
        value = newValue.value;
    }

    // Subscribe to changes in editData
    $: {
        editDataStore.set(editData);
    }

    $: {
        if (editData) {
            handleEditDataChange(editData);
        }
    }

    async function addEditAttribute() {
        try {
            const formData = {
                name,
                value: typeof value === 'string' ? [value.replace(/\s/g, '')] : value
            };

            const url = editForm
                ? `/masterdata/attribute/${id}/update_record/`
                : "/masterdata/attribute/create_record/";

            if (editForm) {
                await API.put(url, formData);
            } else {
                await API.post(url, formData);
            }

            const action = editForm ? "Attribute Updated" : "Attribute Created";
            toast(`${action} successfully!`);

            id = "";
            name = "";
            value = "";

            dispatch('editSuccess')
        } catch (error) {
            const action = editForm ? "Update Attribute" : "Create Attribute";
            console.log(`${action}:`, error);
            toast(`Failed to ${action}`);
        }
    }

    async function saveChanges() {
        await addEditAttribute();
        await refreshtable();

    }

    onMount(() => {
        console.log('EditData:>>>:', editData)
    });
</script>
<Sheet.Root>
    <slot name="additionalButton"></slot>
    <Sheet.Content side="right">
        <Sheet.Header>
            <Sheet.Title>{editForm ? 'Update Attribute' : 'Add Attribute'}</Sheet.Title>
            <Sheet.Description>
                create new attributes here. Add multiple value seprated by comma.Click save when you're done.
            </Sheet.Description>
        </Sheet.Header>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="name" class="text-right">Name</Label>
                <Input id="name" bind:value={editData.name} placeholder="Attribute Name" class="col-span-3"/>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="values" class="text-right">Values</Label>
                <Input id="values" bind:value={editData.value} placeholder="Value1, Value2, Value3" class="col-span-3"/>
            </div>
        </div>
        <Sheet.Footer>
            <Sheet.Close asChild let:builder>
                <Button builders={[builder]} type="submit" on:click={saveChanges}>Save changes</Button>
            </Sheet.Close>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>