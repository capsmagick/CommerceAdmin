<!-- ConfirmDeleteModal.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  export let attribute: any;

  const dispatch = createEventDispatcher();

  function confirmDelete() {
    dispatch("confirm");
  }

  function cancelDelete() {
    dispatch("cancel");
  }
</script>

<Dialog.Root open={true} onOpenChange={cancelDelete}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header>
      <Dialog.Description class="text-lg font-semibold mb-4"
        >Confirm Delete</Dialog.Description
      >
    </Dialog.Header>
    <Label
      >Are you sure you want to delete <span style="color: red"
        >{attribute}</span
      >?</Label
    >
    <Dialog.Footer class="mt-4 flex justify-end">
      <Button variant="ghost" on:click={cancelDelete}>Cancel</Button>
      <Button
        variant="ghost"
        class="text-red-600 hover:text-red-600"
        on:click={confirmDelete}>Delete</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
