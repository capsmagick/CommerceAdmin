<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import ImageUploadModal from "./ImageUploadModal.svelte";
  
    export let open = false;
    export let productId: string;
    export let currentImages: { id: string; image: string }[] = [];
    export let baseUrl: string;
  
    function closeDialog() {
      open = false;
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
        on:imagesUpdated={handleImagesUpdated}
      />
      <Dialog.Footer>
        <button on:click={closeDialog}>Close</button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>