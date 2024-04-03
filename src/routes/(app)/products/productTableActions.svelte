<script lang="ts">
    // import MoreHorizontal from "lucide-svelte/icons/more-horizontal";
    import { MoreHorizontal } from "lucide-svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    function handleEdit() {
        dispatch('edit')
    }

    function handleDelete() {
        dispatch('delete')
    }

    function handleAddVariant() {
        dispatch('addVariant')
    }

    function handleViewVariant() {
        dispatch('viewVariant')
    }
    function handleLookbook() {
        dispatch('addLookbook')
    }
    function handleStatus() {
        dispatch('status')
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
          <DropdownMenu.Item on:click={handleAddVariant}>Add Variant</DropdownMenu.Item>
          <DropdownMenu.Item on:click={handleViewVariant}>View Variant</DropdownMenu.Item>
          <DropdownMenu.Item on:click={handleLookbook}>Add Lookbook</DropdownMenu.Item>
          <!-- <DropdownMenu.Item class="{status? "bg-green-600" : "bg-red-600"}">{status? "Active" : "Inactive"}</DropdownMenu.Item> -->
          <DropdownMenu.Item on:click={handleStatus}>Change Status</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>