<!-- ConfirmDeleteModal.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import * as Card from "$lib/components/ui/card";
  import {Button }from "$lib/components/ui/button";
  import {Label} from "$lib/components/ui/label"

  export let attribute;

  const dispatch = createEventDispatcher();

  function confirmDelete() {
    dispatch('confirm');
  }

  function cancelDelete() {
    dispatch('cancel');
  }
</script>

<div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50" style="color: black">
  <div class="flex items-center justify-center">
    <div class="glow-border" >
      <div class="card glow-border-content bg-background text-foreground">
        <Card.Root class="p-6 rounded-lg">
          <Card.Header>
            <Card.Title class="text-lg font-semibold mb-4">Confirm Delete</Card.Title>
          </Card.Header>
          <Card.Content>
           <Label>Are you sure you want to delete <span style="color: red">{attribute}</span>?</Label>
          </Card.Content>
          <Card.Footer class="mt-4 flex justify-end">
            <Button variant="ghost" on:click={cancelDelete}>Cancel</Button>
            <Button variant="ghost" class="text-red-600 hover:text-red-600" on:click={confirmDelete}>Delete</Button>
          </Card.Footer>
        </Card.Root>
      </div>
    </div>
  </div>
</div>
