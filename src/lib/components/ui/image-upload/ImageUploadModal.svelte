<script lang="ts">
    import API from "$lib/services/api";
    import { createEventDispatcher } from "svelte";
    import { XCircle } from "lucide-svelte";
    import Button from "../button/button.svelte";

    export let productId: string;
    export let currentImages: { id: string; image: string }[] = [];
    export let baseUrl: string;
    export let newImages: File[] = [];
  
    let fileInput: HTMLInputElement;
    let dispatch = createEventDispatcher();

    async function deleteImage(imageId: string) {
      try {
        await API.delete(`/products/product-image/${imageId}/delete_record/`);

        const res = await API.get(`/products/product/${productId}`);
        const updatedImages = res.data.images.map((image: { id: string; image: string }) => ({
          id: image.id,
          image: `${baseUrl}${image.image}`,
        }));

        dispatch("imagesUpdated", updatedImages);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    function handleFileInput(event: Event) {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        newImages = Array.from(files);
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            const newImage = {
              id: crypto.randomUUID(),
              image: reader.result as string,
            };
            currentImages = [...currentImages, newImage];
          };
          reader.readAsDataURL(file);
        });
      }
    }
</script>
  
<div class="p-4">
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {#each currentImages as image}
      <div class="relative">
        <Button
          variant="link"
          on:click={() => deleteImage(image.id)}
          class="absolute top-1 right-1 text-red-500 hover:text-red-700">
          <XCircle size="20" />
        </Button>
        <div class="w-full h-full overflow-hidden rounded-lg">
            <img
            src={`${baseUrl}${image.image}`}
            alt="product_image"
            class="w-full h-full object-cover"
            />
          </div>
        </div>
        {/each}
      </div>
      <div class="grid gap-2 p-5">
        <input type="file" multiple hidden on:change={handleFileInput} bind:this={fileInput}/>
        <Button variant="outline" on:click={() => fileInput.click()}>Upload Image</Button>
      </div>
</div>