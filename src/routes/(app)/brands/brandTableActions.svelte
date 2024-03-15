<script lang="ts">
    import {MoreHorizontal} from "lucide-svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import {Button} from "$lib/components/ui/button";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    function handleEdit() {
        dispatch('edit')
    }

    function handleDelete() {
        dispatch('delete')
    }

</script>

<!--<DropdownMenu.Root>-->
<!--    <DropdownMenu.Trigger asChild let:builder>-->
<!--        <Button-->
<!--                variant="ghost"-->
<!--                builders={[builder]}-->
<!--                size="icon"-->
<!--                class="relative h-8 w-8 p-0"-->
<!--        >-->
<!--            <span class="sr-only">Open menu</span>-->
<!--            <MoreHorizontal class="h-4 w-4"/>-->
<!--        </Button>-->
<!--    </DropdownMenu.Trigger>-->
<!--    <DropdownMenu.Content>-->
<!--        <DropdownMenu.Group>-->
<!--            <DropdownMenu.Label>Actions</DropdownMenu.Label>-->
<!--        </DropdownMenu.Group>-->
<!--        <DropdownMenu.Separator/>-->
<!--        <DropdownMenu.Item on:click={handleEdit}><i class="fa fa-pencil sm mr-2"></i>Edit-->
<!--        </DropdownMenu.Item>-->
<!--        <DropdownMenu.Item on:click={handleDelete}><i class="fa fa-trash sm mr-2" style="color:red"></i>Delete-->
<!--        </DropdownMenu.Item>-->
<!--    </DropdownMenu.Content>-->
<!--</DropdownMenu.Root>-->

<div class="flex justify-left">
    <button on:click={handleEdit}><i class="fa fa-edit" style="color:#6d28d9"></i></button>
    <h1 class="ml-2 mr-2 font-semibold">|</h1>
    <button on:click={handleDelete}><i class="fa fa-trash" style="color:red"></i></button>
</div>