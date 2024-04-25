<script lang="ts">
  import { onMount } from "svelte";
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import { createEventDispatcher } from "svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  const dispatch = createEventDispatcher();

  const baseUrl: string = import.meta.env.VITE_BASE_URL as string;

  export let editData: any;
  let productData: any = {};


  if (editData) {
    productData = editData;
    console.log("productData: ", productData.images);
  }

  function cancelModel() {
    dispatch("cancel");
  }


</script>

        <Dialog.Root open={true} onOpenChange={cancelModel} preventScroll={true}>
          <Card.Header></Card.Header>
          <Dialog.Content>
            <div class="grid grid-cols-2 gap-6 p-3">
              <div class="grid-cols-1">
                <Carousel.Root class="w-full max-w-xs">
                  <Carousel.Content>
                    {#each productData.images as image, i (i)}
                                <Carousel.Item>
                                  <div class="p-1">
                                    <Card.Root>
                                      <Card.Content
                                        class="flex aspect-square items-center justify-center p-6"
                                      >
                                         <img src={`${baseUrl}${image.image}`} alt={`Image ${i + 1}`} />
                                      </Card.Content>
                                    </Card.Root>
                                  </div>
                                </Carousel.Item>
                              {/each}
                  </Carousel.Content>
                  <Carousel.Previous />
                  <Carousel.Next />
                </Carousel.Root>
              </div>
              <div class="grid-cols-1">
                <h1 class="text-2xl font-bold mb-2">{productData.name}</h1>
                <p class="mb-1">MRP: {productData.price}</p>
                <p class="mb-1">Ratings: {productData.rating}</p>
                <p class="mb-1">Reviews: {productData.no_of_reviews}</p>
                <p class="mb-1">Descripiton: {productData.description}</p>

                <hr />
                <p class="mx-1">Category: {productData.categories[0] ? productData.categories[0].name:''}</p>
              </div>
            </div>
            <Dialog.Footer class="justify-end space-x-2">
              <Button variant="destructive" on:click={() => cancelModel()}
                >Cancel</Button
              >
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
