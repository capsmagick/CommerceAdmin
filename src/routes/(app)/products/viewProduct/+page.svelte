<script lang="ts">
  import { onMount } from "svelte";
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import { createEventDispatcher } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import { Label } from "$lib/components/ui/label";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
  import { writable } from "svelte/store";
  import { toast } from "svelte-sonner";
  import { Value } from "svelte-radix";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Carousel from "$lib/components/ui/carousel/index.js";

  const dispatch = createEventDispatcher();

  export let editData: any;
    let productId:any;
    let productDetails: any = [{
      id: '',
      name: '',
      short_description: '',
      description: '',
      sku: '',
      price: '',
      selling_price: '',
      condition: '',
      categories: [],
      brand: '',
      is_disabled: false,
      hsn_code: '',
      rating: '',
      tags:[],
      no_of_reviews: null,
    }]
    let variant: any;
    let tag: any;
    let category: any;
    let image:any

    if (editData) {
      productId = editData  
  }


  async function fetchProduct() {
    try {
      const res = await API.get(`/products/product/${productId}`);
      productDetails = res.data;
      console.log( productDetails );

    } catch (error) {
      console.log("Product:", error);
    }
  }

  async function fetchVariants() {
    try {
      const res = await API.get(`/products/variant/?product=${productId}`);
      variant = res.data.results;
    } catch (error) {
      console.log("Product: Variant:", error);
    }
  }

  async function fetchImages() {
    try {
      const res = await API.get(`/products/product-image/?product=${productId}`);
      image = res.data.results;
      console.log("image: ", image);
    } catch (error) {
      console.log("Product: Variant:", error);
    }
  }

  async function fetchTags() {
    try {
      const res = await API.get(`/masterdata/tag/${productDetails.tags}`);
      tag = res.data;
    } catch (error) {
      console.log("Product: Variant:", error);
    }
  }

  async function fetchCategories() {
    try {
      const res = await API.get(`/masterdata/category/${productDetails.categories}`);
      category = res.data;
    } catch (error) {
      console.log("Product: Variant:", error);
    }
  }



  function cancelModel() {
    dispatch("cancel");
  }
  function handleClickOutside(event: any) {
    if (!event.target.closest(".card")) {
      cancelModel();
    }
  }
    onMount(async () => {
      await fetchProduct();
      await fetchVariants();
      await fetchTags();
      await fetchCategories();
      await fetchImages();
  });

  onMount(() => {
    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });


</script>

<div class="fixed bg-background inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
      <div class="flex items-center justify-center">
        <div class="glow-border" >
        <div class="card glow-border-content bg-background text-foreground overflow-y-auto" style="max-height:90vh;">
            <Card.Root>
               {#if image}
                <Card.Content>
                 
                  
                    <div class="grid grid-cols-2 gap-6 p-3">
                      <div class="grid-cols-1">
                          <Carousel.Root class="w-full max-w-xs">
                            <Carousel.Content>
                              {#each image as image, i (i)}
                                <Carousel.Item>
                                  <div class="p-1">
                                    <Card.Root>
                                      <Card.Content
                                        class="flex aspect-square items-center justify-center p-6"
                                      >
                                         <img src={image.image} alt={`Image ${i + 1}`} />
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
                          <h1 class="text-2xl font-bold mb-2">{productDetails.name}</h1>
                          <p class="mb-1">MRP: {productDetails.price}</p>
                          <p class="mb-1">Ratings: {productDetails.rating}</p>
                          <p class="mb-1">Reviews: {productDetails.no_of_reviews}</p>
                          <p class="mb-1">Descripiton: {productDetails.description}</p>

                          <hr>
                          {#if tag}
                          <p class="mx-1">Tag: {tag.name}</p>
                          {/if}

                          {#if category}
                          <p class="mx-1">Category: {category.name}</p>
                          {/if}
                      </div>
                    </div>
                   
          </Card.Content>
          <Card.Footer class="justify-end space-x-2">
            <Button variant="destructive" on:click={() => cancelModel()}
              >Cancel</Button>
          </Card.Footer>
        {:else}
              <div class="grid-cols-2 gap-6 flex justify-center align-items-center p-3"><i class="fa-solid fa-circle-notch fa-spin"></i></div>
        {/if}
        </Card.Root>
      </div>
    </div>
  </div>
</div>

<style>
  .card::-webkit-scrollbar {
    display: none;
  }
  /* .input, .textarea, .select, .btn {
    width: 100%;
    padding: 0.5rem;
    margin: 0.5rem 0;
    box-sizing: border-box;
    border: 2px solid #e2e8f0;
    border-radius: 0.375rem; /* 6px 
  } */

  /* .btn {
    background-color: #4f46e5; /* Indigo 
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn:hover {
    background-color: #4338ca; /* Darker Indigo 
  } */
</style>