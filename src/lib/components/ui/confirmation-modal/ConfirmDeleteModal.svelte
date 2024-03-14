<!-- ConfirmDeleteModal.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';

  export let attribute;

  const dispatch = createEventDispatcher();

  function confirmDelete() {
    dispatch('confirm');
  }

  function cancelDelete() {
    dispatch('cancel');
  }
</script>

<div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
  <div class="bg-white p-6 rounded-lg">
    <h2 class="text-lg font-semibold mb-4">Confirm Delete</h2>
    <p>Are you sure you want to delete <span style="color: red">{attribute}</span>?</p>
    <div class="mt-4 flex justify-end">
      <button class="text-red-500 mr-4" on:click={confirmDelete}>Delete</button>
      <button class="text-gray-600" on:click={cancelDelete}>Cancel</button>
    </div>
  </div>
</div>
