<script lang="ts">
    import {Input} from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import {Textarea} from "$lib/components/ui/textarea";
    import {Select} from "$lib/components/ui/select";
    import {Button} from "$lib/components/ui/button";
    import API from "$lib/services/api";
    import {createEventDispatcher} from "svelte";
    import {toast} from "svelte-sonner";
    import * as Card from "$lib/components/ui/card";

    const dispatch = createEventDispatcher();

    export let editData;
    export let editForm;

    let tagDetails = {
        name: "",
    };
    let id = "";

    if (editForm) {
        tagDetails = {
            name: editData.name,
        };
        id = editData.id;
    }

    async function createTag() {
        try {
            const form = new FormData();
            form.append("name", tagDetails.name);

            const url = editForm ? `/masterdata/tag/${id}/update_record/` : "/masterdata/tag/create_record/";

            if (editForm) {
                await API.put(url, form);
            } else {
                await API.post(url, form);
            }

            dispatch("newTag");
            const action = editForm ? "Tag Updated" : "Tag Created";
            toast(`${action} successfully!`);
        } catch (error) {
            const action = editForm ? "Update Tag" : "Create Tag";
            console.log(`${action}:`, error);
            toast(`Failed to ${action}`);
        }
    }
</script>

<div class="fixed bg-background inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
   <div class="flex items-center justify-center">
       <div class="glow-border">
           <div class="card glow-border-content bg-background text-foreground">
                <Card.Root class="p-6 rounded-lg">
                    <Card.Header class="font-bold mb-5">
                        <Card.Title>{editForm ? 'Update Tag' : 'New Tag'}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                            <div class="mb-3">
                                <Label for="name">Name</Label>
                                <Input id="name" bind:value={tagDetails.name} placeholder="Name" class="input"/>
                            </div>
                    </Card.Content>
                    <Card.Footer  class="justify-between space-x-2">
                        <Button type="button" variant="ghost" on:click={() => dispatch("close")}>Cancel</Button>
                        <Button type="submit"  on:click={createTag}>Save</Button>
                    </Card.Footer>
                </Card.Root>
           </div>
       </div>
   </div>
</div>

