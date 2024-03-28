<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
    import { toast } from "svelte-sonner";

    const dispatch = createEventDispatcher();
    import API from "$lib/services/api";
    import {Button }from "$lib/components/ui/button"
    import {Label} from "$lib/components/ui/label"
    import {Input} from "$lib/components/ui/input"
    import * as Card from "$lib/components/ui/card"

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
    document.addEventListener('mousedown', handleClickOutside);
  }, 100);

  return () => {
    clearTimeout(timeout);
    document.removeEventListener('mousedown', handleClickOutside);
  };
});
</script>

<div class="fixed bg-background inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
    <div class="flex items-center justify-center">
      <div class="glow-border" >
      <div class="card glow-border-content bg-background text-foreground">
        <!--        <div class="flex items-center justify-between mb-2">-->
        <Card.Root>
            <Card.Header class="font-bold mb-5">
                {#if editForm === false}
                    <Card.Title>New Attribute</Card.Title>
                {:else}
                    <Card.Title>Update Attribute</Card.Title>
                {/if}
                <!--            <button on:click={() => dispatch("close")}>-->
                <!--                <i class="fa-solid fa-xmark"></i>-->
                <!--            </button>-->
            </Card.Header>
            <Card.Content>
                <div>
                    <Label
                            for="name"
                            class="block text-sm font-medium leading-6 text-gray-500 mb-2">Name</Label>
                    <div class="mb-2">
                        <Input required
                               type="text"
                               name="name"
                               id="name"
                               bind:value={name}/>
                    </div>
                </div>
                <div>
                    <Label
                            for="value"
                            class="block text-sm font-medium leading-6 text-gray-500 mb-2">Value</Label>
                    <div class="mt-2">
                        <Input required
                               type="text"
                               name="value"
                               id="value"
                               bind:value={value}/>
                        <span style="color: #17a2b8;">Kindly Use comma (',') to separate the values</span>
                    </div>
                </div>
            </Card.Content>
            <Card.Footer class="justify-between space-x-2">
                    <Button variant="ghost"
                            on:click={() => dispatch("cancel")}>
                            Cancel
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
