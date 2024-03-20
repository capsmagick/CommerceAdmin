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
   
    export let id: string;



  </script>
   
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <Button
        variant="ghost"
        builders={[builder]}
        size="icon"
        class="relative h-8 w-8 p-0"
      >
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item
        class="text-gray-700"
        on:click={handleEdit}>
          <i class="fa-solid fa-pencil"></i>
      </DropdownMenu.Item>
      <DropdownMenu.Item
        class="text-red-500"
        on:click={handleDelete}>
          <i class="fa-solid fa-trash"></i>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>