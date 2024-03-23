<script lang="ts">
    // import MoreHorizontal from "lucide-svelte/icons/more-horizontal";
    import { MoreHorizontal } from "lucide-svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import {createEventDispatcher} from "svelte";
   
    export let id: string;



    const dispatch = createEventDispatcher();

    function handleEdit() {
        dispatch('edit')
    }

    function handleDelete() {
        dispatch('delete')
    }
  </script>
   
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <Button
        variant="ghost"
        builders={[builder]}
        size="icon"
        class="h-8 w-8 p-0"
      >
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
          <DropdownMenu.Item on:click={handleEdit}><i class="fa fa-pencil sm mr-2"></i>Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item on:click={handleDelete}><i class="fa fa-trash sm mr-2" style="color:red"></i>Delete
          </DropdownMenu.Item>
          <DropdownMenu.Item>Add Variant</DropdownMenu.Item>
          <DropdownMenu.Item>Change status</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>