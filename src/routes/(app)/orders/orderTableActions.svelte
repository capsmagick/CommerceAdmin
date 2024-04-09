<script lang="ts">
    // import MoreHorizontal from "lucide-svelte/icons/more-horizontal";
    import { MoreHorizontal } from "lucide-svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import {createEventDispatcher} from "svelte";
  import { item } from "@unovis/ts/components/bullet-legend/style";

    const dispatch = createEventDispatcher();

    function handleProcessing() {
        dispatch('processing')
    }

    function handlePacking() {
        dispatch('packing')
    }

    function handleReady() {
        dispatch('ready')
    }

    function handleShipped() {
        dispatch('shipped')
    }

    function handleDelivered() {
        dispatch('delivered')
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
      <DropdownMenu.Item on:click={handleProcessing}>Order Processing</DropdownMenu.Item>
      <DropdownMenu.Item on:click={handlePacking}>Order Packing</DropdownMenu.Item>
      <DropdownMenu.Item on:click={handleReady}>Order Ready for Dispatch</DropdownMenu.Item>
      <DropdownMenu.Item on:click={handleShipped}>Order Shipped</DropdownMenu.Item>
      <DropdownMenu.Item on:click={handleDelivered}>Order Delivered</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>