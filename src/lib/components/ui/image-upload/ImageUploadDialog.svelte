<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import ImageUploadModal from "./ImageUploadModal.svelte";
    import Button from "../button/button.svelte";
    import { createEventDispatcher } from 'svelte';
    import API from "$lib/services/api";
  
    const dispatch = createEventDispatcher();

    export let open = false;
    export let productId: string;
    export let currentImages: { id: string; image: string }[] = [];
    export let baseUrl: string;

    let newImages: File[] = [];
    let imagesToDelete: string[] = []
  
    function closeDialog() {
      dispatch('close');
      newImages = [];
    }

    function handleImagesUpdated(event: CustomEvent<{ id: string; image: string }[]>) {
      // Update the product's image list with the new images
      const updatedImages = event.detail;
      // ... update your data accordingly
    }

    async function deleteImages() {
      try {
        for (const imageId of imagesToDelete) {
          await API.delete(`/products/product-image/${imageId}/delete_record/`);
        }
        imagesToDelete = [];
        dispatch("updateTableData");
        closeDialog();
      } catch (error) {
        console.error("Error deleting images:", error);
      }
    }

    async function saveImages() {
      try {
        if (!newImages || newImages.length === 0){
          await deleteImages();
          return;
        } 

        for (const file of newImages) {
          const formData = new FormData();
          formData.append(`image`, file);
          formData.append("alt_text", "Product Image");
          formData.append("product", productId);
          await API.post("/products/product-image/create_record/", formData);
        }

        await deleteImages();
        
        // Fetch updated images from the server
        const res = await API.get(`/products/product/${productId}`);
        const updatedImages = res.data.images.map((image: { id: string; image: string }) => ({
          id: image.id,
          image: `${baseUrl}${image.image}`,
        }));

        dispatch("imagesUpdated", updatedImages);
        dispatch("updateTableData");
        newImages = [];
        closeDialog();
      } catch (error) {
        console.error("Error uploading images:", error);
      }
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
        bind:newImages
        bind:imagesToDelete/>
      <Dialog.Footer>
        <Button variant="ghost" on:click={closeDialog}>Cancel</Button>
        <Button on:click={saveImages}>save</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>