<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import ReusableButton from "../Reusable/Button.svelte";
  let name = "";
  let value = {
    propOne: "",
  };

  async function onCreateNewAttribute() {
    try {
      const formData = {
        name,
        value,
      };
      const response = await fetch(
        "/api/masterdata/attribute/create_record/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEwMTgyMzIyLCJpYXQiOjE3MTAxNzg3MjIsImp0aSI6IjQyNDI2ZmYxNzUwMDQ2NzU5YTI0MjkzODE1Y2EzMjc4IiwidXNlcl9pZCI6Mn0.NLjfbNyijmSc8278y8T5K6QSCyqw3OmLTv2ZqMcZtYE",
          },
          body: JSON.stringify(formData),
        }
      );

      dispatch("newAttribute")
    } catch (error) {
      console.log("Attribute create:", error);
    }
  }
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <h4>New Attribute</h4>
    <button on:click={() => dispatch("close")}>
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
  <div class="w-1/2">
    <label
      for="first-name"
      class="block text-sm font-medium leading-6 text-gray-500">Name</label
    >
    <div class="mt-2">
      <input
        type="text"
        name="first-name"
        id="first-name"
        class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
        bind:value={name}
      />
    </div>
  </div>
  <div>
    <ReusableButton label={"Create Attribute"} on:close={onCreateNewAttribute} />
  </div>
</div>
