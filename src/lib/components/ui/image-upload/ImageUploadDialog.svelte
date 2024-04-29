<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import ImageUploadModal from "./ImageUploadModal.svelte";
    import Button from "../button/button.svelte";
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();

    export let open = false;
    export let productId: string;
    export let currentImages: { id: string; image: string }[] = [];
    export let baseUrl: string;
  
    function closeDialog() {
      dispatch('close');
    }

    function handleImagesUpdated(event: CustomEvent<{ id: string; image: string }[]>) {
      // Update the product's image list with the new images
      const updatedImages = event.detail;
      // ... update your data accordingly
    }
  </script>
  
  <Dialog.Root open={open} onOpenChange={closeDialog}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Upload Images</Dialog.Title>
      </Dialog.Header>
      <ImageUploadModal
        {productId}
        {currentImages}
        {baseUrl}
        on:imagesUpdated={handleImagesUpdated}/>
      <Dialog.Footer>
        <Button variant="ghost" on:click={closeDialog}>Cancel</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>