<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";

  let categoryDetails: any = {
    name: "",
    description: "",
    handle: "",
    parent_category: 0,
    second_parent_category: 0,
    attribute_group: 0,
  };

  let attributeGroups: any = [];
  let selectedAttributeGroup: string;
  let parent_category: string;
  let second_parent_category: string;
  let categories: any[] = [];
  let imageUpload: any;
  let image: any;

  async function fetchCategories() {
    try {
      const res = await API.get("/masterdata/category/");
      categories = Array.isArray(res.data?.results) ? res.data.results : [];
    } catch (error) {
      console.log("category:fetch-category:", error);
      categories = [];
    }
  }

  async function fetchAttributeGroups() {
    try {
      const res = await API.get("/masterdata/attributegroup/");
      attributeGroups = res.data.results;
    } catch (error) {
      console.log("category:fetch-attribute-group:", error);
    }
  }

  async function createCategory() {
    try {
      const formData = new FormData();

      for (const val in categoryDetails) {
        formData.append(val, categoryDetails[val]);
      }

      formData.append("image", image);
      await API.post("/masterdata/category/create_record/", formData);
    } catch (error) {}
  }

  function handleGroupChange(selectedGroup: { value: number }) {
    categoryDetails.attribute_group = selectedGroup.value;
    selectedAttributeGroup = attributeGroups.find(
      (g: any) => g.id == selectedGroup.value
    ).name;
  }

  function handleParentCat(selectedCat: { value: number }) {
    categoryDetails.parent_category = selectedCat.value;
    parent_category = categories.find(
      (g: any) => g.id == selectedCat.value
    ).name;
  }

  function handleSecondaryParentCat(selectedCat: { value: number }) {
    categoryDetails.second_parent_category = selectedCat.value;
    second_parent_category = categories.find(
      (g: any) => g.id == selectedCat.value
    ).name;
  }

  //   Logo upload
  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    image = imageUpload.files[0];
    const img: any = document.getElementById("selected-logo");
    img.src = window.URL.createObjectURL(image);
  }
  // Mount
  onMount(async () => {
    await fetchCategories();
    await fetchAttributeGroups();
  });
</script>

<div class="m-3">
  <div
    class="bg-white rounded-md p-4 px-6 border overflow-y-auto"
    style="height: calc(100vh - 58px);"
  >
    <div class="container mx-auto max-w-4xl py-8 px-4">
      <h2 class="text-3xl font-bold mb-6 text-center">Add Category</h2>
      <form
        on:submit|preventDefault={createCategory}
        class="space-y-6 bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4"
      >
        <Input
          bind:value={categoryDetails.name}
          placeholder="Name"
          class="input"
        />
        <Textarea
          bind:value={categoryDetails.description}
          placeholder="Description"
          class="textarea"
        />

        <div class="grid grid-cols-2 gap-4">
          <Input
            bind:value={categoryDetails.handle}
            placeholder="Handle"
            class="input"
          />
          <Select.Root>
            <Select.Trigger class="input capitalize"
              >{selectedAttributeGroup
                ? selectedAttributeGroup
                : "Select a Attribute Group"}</Select.Trigger
            >
            <Select.Content>
              <Select.Group>
                {#each attributeGroups as group}
                  <Select.Item
                    value={group.id}
                    label={group.name}
                    class="capitalize"
                    on:click={() => handleGroupChange({ value: group.id })}
                  >
                    {group.name}
                  </Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <Select.Root>
            <Select.Trigger class="input capitalize"
              >{parent_category
                ? parent_category
                : "Select Parent Category"}</Select.Trigger
            >
            <Select.Content>
              <Select.Group>
                {#each categories as category}
                  <Select.Item
                    value={category.id}
                    label={category.name}
                    class="capitalize"
                    on:click={() => handleParentCat({ value: category.id })}
                  >
                    {category.name}
                  </Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
          <!-- Secondary parent category -->
          <Select.Root>
            <Select.Trigger class="input capitalize"
              >{second_parent_category
                ? second_parent_category
                : "Select secondary parent category"}</Select.Trigger
            >
            <Select.Content>
              <Select.Group>
                {#each categories as category}
                  <Select.Item
                    value={category.id}
                    label={category.name}
                    class="capitalize"
                    on:click={() =>
                      handleSecondaryParentCat({ value: category.id })}
                  >
                    {category.name}
                  </Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <div class="flex items-center gap-2">
          <Button
            type="button"
            class="btn flex gap-2 items-center bg-indigo-500 text-white text-xs"
            on:click={pickAvatar}
            ><i class="fa-solid fa-image text-sm"></i>Upload category image
          </Button>
          <img id="selected-logo" alt="" class={image ? "showImg" : "hideImg"} />
          <input
            type="file"
            id="file-input"
            bind:this={imageUpload}
            hidden
            accept="image/png, image/jpeg"
            on:input={uploadAvatar}
          />
        </div>
        <!-- Assuming Select component exists and can handle multiple selections -->
        <div class="grid grid-cols-2 gap-4"></div>
        <Button type="submit" class="btn">Submit</Button>
      </form>
    </div>
  </div>
</div>

<style>
  .hideImg {
    visibility: hidden;
  }

  .showImg {
    display: block;
    height: 6rem;
    width: 6rem;
    flex: none;
    border-radius: 20px;
    object-fit: cover;
  }
</style>
