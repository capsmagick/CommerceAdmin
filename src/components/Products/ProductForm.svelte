<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col">
  <!-- header -->
  <div class="flex items-center justify-between">
    <button on:click={() => dispatch("close")}>
      <i class="fa-solid fa-xmark"></i>
    </button>
    <div>
      <button
        class="text-xs flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-1.5 rounded"
      >
        <span>
        </span>Publish Product</button
      >
    </div>
  </div>
  <div class="divide-y divide-white/5">
    <div
      class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
    >
      <div>
        <h2 class="text-base font-semibold leading-7 text-gray-500">
          General information
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">
          To start selling, all you need is a name and a price.
        </p>
      </div>

      <form class="md:col-span-2">
        <div
          class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6"
        >
          <div class="sm:col-span-3">
            <label
              for="first-name"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Title</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="first-name"
                id="first-name"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label
              for="last-name"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Subtitle</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="first-name"
                id="first-name"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label
              for="first-name"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Handle</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="first-name"
                id="first-name"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label
              for="last-name"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Material</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="first-name"
                id="first-name"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="col-span-full">
            <label
              for="timezone"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Timezone</label
            >
            <div class="mt-2">
              <textarea
                name=""
                id=""
                cols="30"
                rows="5"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
    <!--  Organize-->
    <div
      class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
    >
      <div>
        <h2 class="text-base font-semibold leading-7 text-gray-500">
            Organize
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">
            To start selling, all you need is a name and a price.
        </p>
      </div>

      <form class="md:col-span-2">
        <div
          class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6"
        >
          <div class="sm:col-span-3">
            <label
              for="first-name"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Title</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="first-name"
                id="first-name"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label
              for="last-name"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Subtitle</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="first-name"
                id="first-name"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label
              for="first-name"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Handle</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="first-name"
                id="first-name"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label
              for="last-name"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Material</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="first-name"
                id="first-name"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="col-span-full">
            <label
              for="timezone"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Timezone</label
            >
            <div class="mt-2">
              <textarea
                name=""
                id=""
                cols="30"
                rows="5"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
    <!-- Variants -->
    <div
      class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
    >
      <div>
        <h2 class="text-base font-semibold leading-7 text-gray-500">
            Variants
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">
            Add variations of this product.<br/>
Offer your customers different options for color, format, size, shape, etc.
        </p>
      </div>

      <form class="md:col-span-2">
        <div
          class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6"
        >
          <div class="sm:col-span-3">
            <label
              for="first-name"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Title</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="first-name"
                id="first-name"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label
              for="last-name"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Subtitle</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="first-name"
                id="first-name"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label
              for="first-name"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Handle</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="first-name"
                id="first-name"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label
              for="last-name"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Material</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="first-name"
                id="first-name"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="col-span-full">
            <label
              for="timezone"
              class="block text-sm font-medium leading-6 text-gray-500"
              >Timezone</label
            >
            <div class="mt-2">
              <textarea
                name=""
                id=""
                cols="30"
                rows="5"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
