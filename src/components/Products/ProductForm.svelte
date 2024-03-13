<script>
  import { createEventDispatcher } from "svelte";
  import API from "../../services/api";
  import ReusableButton from "../Reusable/Button.svelte";
  const dispatch = createEventDispatcher();

  let productDetails = {
    name:"",
    description:"",
    short_description:"",
    sku:"",
    price:0,
    selling_price:0,  
    condition:"",
    brand: 3,
    categories:[2]
  }

  async function createProduct() {
    try {
      await API.post("/products/product/create_record/", {
        ...productDetails
      });

      dispatch("newProduct");
    } catch (error) {
      console.log("create:product:", error);
    }
  }
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <h4>New Product</h4>
    <button on:click={() => dispatch("close")}>
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>

  <!-- Text input -->
  <div class="w-1/2 flex flex-col gap-2">
    <!-- Text input -->
    <div class="mb-4 w-full">
      <label for="cdc81027-a20f-49e1-ba53-4d97478b3a71" class="text-sm text-gray-500">Name</label>
      <input
        placeholder="Product Name"
        type="text"
        id="cdc81027-a20f-49e1-ba53-4d97478b3a71"
        class="w-full mt-1 block rounded-lg border dark:border-none dark:bg-neutral-600 py-[9px] px-3 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
        bind:value={productDetails.name}
        />
    </div>

    <!-- Text input -->
    <div class="mb-4 w-full">
      <label for="f0b359c7-8321-48c0-b83a-335b62fc49c0"class="text-sm text-gray-500">Short Description</label>
      <input
        placeholder="Product short description"
        type="text"
        id="f0b359c7-8321-48c0-b83a-335b62fc49c0"
        class="w-full block mt-1 rounded-lg border dark:border-none dark:bg-neutral-600 py-[9px] px-3 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
        bind:value={productDetails.short_description}
        />
    </div>

    <!-- Textarea -->
    <div class="mb-4 w-full">
      <label for="42d95720-922b-4e9e-a791-6a82e48e7b37"class="text-sm text-gray-500">Description</label>
      <textarea
        placeholder="Product Description"
        type="password"
        id="42d95720-922b-4e9e-a791-6a82e48e7b37"
        rows="4"
        class="w-full block rounded-lg border dark:border-none dark:bg-neutral-600 py-[9px] px-3 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
        bind:value={productDetails.description}
        ></textarea>
    </div>

    <!-- Text input -->
    <div class="mb-4 w-full">
      <label for="ad54549b-db62-483a-850d-2a4ae822dc89"class="text-sm text-gray-500">SKU</label>
      <input
        placeholder="product sku"
        type="text"
        id="ad54549b-db62-483a-850d-2a4ae822dc89"
        class="w-full block rounded-lg border dark:border-none dark:bg-neutral-600 py-[9px] px-3 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
        bind:value={productDetails.sku}
        />
    </div>

    <!-- Text input -->
    <div class="mb-4 w-full">
      <label for="7ed710a6-b0b5-4eff-91aa-ac233b917d24"class="text-sm text-gray-500">Price</label>
      <input
        placeholder="Product price"
        type="number"
        id="7ed710a6-b0b5-4eff-91aa-ac233b917d24"
        class="w-full block rounded-lg border dark:border-none dark:bg-neutral-600 py-[9px] px-3 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
        bind:value={productDetails.price}
        />
    </div>

    <!-- Text input -->
    <div class="mb-4 w-full">
      <label for="60cfa2c6-e658-498d-a52b-0574afdf9dc9"class="text-sm text-gray-500">Selling Price</label>
      <input
        placeholder="Product selling price"
        type="text"
        id="60cfa2c6-e658-498d-a52b-0574afdf9dc9"
        class="w-full block rounded-lg border dark:border-none dark:bg-neutral-600 py-[9px] px-3 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
        bind:value={productDetails.selling_price}
        />
    </div>

    <!-- Text input -->
    <div class="mb-4 w-full">
      <label for="bdbab9c3-5c6a-4aa4-9dab-fd144ed7c2af"class="text-sm text-gray-500">Condition</label>
      <input
        placeholder="Product condition"
        type="text"
        id="bdbab9c3-5c6a-4aa4-9dab-fd144ed7c2af"
        class="w-full block rounded-lg border dark:border-none dark:bg-neutral-600 py-[9px] px-3 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
        bind:value={productDetails.condition}
        />
    </div>
  </div>
  <div>
    <ReusableButton label={"Create Category"} on:click={createProduct} />
  </div>
</div>
