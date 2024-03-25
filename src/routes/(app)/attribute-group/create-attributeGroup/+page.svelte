<script lang="ts">
    import {onMount} from "svelte";
    import {createEventDispatcher} from "svelte";
    import {toast} from "svelte-sonner";
    import * as Select from "$lib/components/ui/select";

    const dispatch = createEventDispatcher();
    import API from "$lib/services/api";
    import {Button} from "$lib/components/ui/button"
    import * as Card from "$lib/components/ui/card"
    import {Label} from "$lib/components/ui/label"
    import {Input} from "$lib/components/ui/input"

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

      function cancelDelete() {
    dispatch('cancel');
  }
    function handleClickOutside(event) {
    if (!event.target.closest('.card')) {
      cancelDelete();
    }
  }
  
onMount(() => {
  const timeout = setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  }, 500);

  return () => {
    clearTimeout(timeout);
    document.removeEventListener('click', handleClickOutside);
  };
});
</script>

<div class="fixed bg-background inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
    <div class="flex items-center justify-center">
        <div class="glow-border" >
            <div class="card glow-border-content bg-background text-foreground">
                <Card.Root>
                    <Card.Header class="font-bold mb-5">
                        {#if editForm === false}
                            <Card.Title>New Attribute Group</Card.Title>
                        {:else}
                            <Card.Title>Update Attribute Group</Card.Title>
                        {/if}
                    </Card.Header>
                    <Card.Content>
                        <div>
                            <Label for="name">Name</Label>
                            <div class="mb-2">
                                <Input required
                                       type="text"
                                       name="name"
                                       id="name"
                                       bind:value={name}/>
                            </div>
                        </div>
                        <div>
                            <div class="mt-2">
                                <Select.Root>
                                    <Select.Trigger class="input capitalize">
                                        {selectedAttributeNames
                                        ? selectedAttributeNames
                                        : "Select a Attributes"}</Select.Trigger>
                                    <Select.Content>
                                        <Select.Group>
                                            {#each attribute as a}
                                                <Select.Item
                                                        value={a.id}
                                                        label={a.name}
                                                        class="capitalize"
                                                        on:click={() => handleAttributeChange({ value: a.id })}>
                                                    {a.name}
                                                </Select.Item>
                                            {/each}
                                        </Select.Group>
                                    </Select.Content>
                                </Select.Root>
                            </div>
                        </div>
                    </Card.Content>
                    <Card.Footer class="justify-between space-x-2">
                        <Button variant="ghost"
                                on:click={() => dispatch("cancel")}>Cancel
                        </Button>
                        {#if editForm === false}
                            <Button type=submit
                                    on:click={() =>onCreateNewAttribute()}>
                                    Save
                            </Button>
                        {:else}
                            <Button on:click={() =>onCreateNewAttribute()}>
                                    Update
                            </Button>
                        {/if}
                    </Card.Footer>
                </Card.Root>
            </div>
        </div>
    </div>
</div>