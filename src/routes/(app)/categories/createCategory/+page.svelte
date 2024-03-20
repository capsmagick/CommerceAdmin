<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { toast } from "svelte-sonner";

  const dispatch = createEventDispatcher();

  export let editData;
  export let editForm:boolean;

  let categoryDetails: any = {
    name: "",
    description: "",
    handle: "",
    image: "",
    parent_category: 0,
    second_parent_category: 0,
    attribute_group: 0,
    tags: [],
  };

  let id = "";

  if (editForm) {
    categoryDetails = {
      name: editData.name,
      description: editData.description,
      handle: editData.handle,
      parent_category: editData.parent_category,
      second_parent_category: editData.second_parent_category,
      image: editData.image,
      attribute_group: editData.attribute_group,
      tags: editData.tags,
    };
    id = editData.id;
  }

  let tags: any = [];
  let selectedTags: string;
  let attributeGroups: any = [];
  let selectedAttributeGroup: string;
  let parent_category: string;
  let second_parent_category: string;
  let categories: any[] = [];
  let imageUpload: any;
  let image: any;

  let selectedTagName:string

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

  async function fetchTags() {
    try {
      const res = await API.get("/masterdata/tag/");
      tags = res.data.results;
    } catch (error) {
      console.log("category:fetch-tags:", error);
    }
  }

  async function createCategory() {
    try {
      const formData = new FormData();

        formData.append("name", categoryDetails.name);
        formData.append("description", categoryDetails.description);
        formData.append("handle", categoryDetails.handle);
        if(categoryDetails.parent_category.length > 1) formData.append("parent_category", categoryDetails.parent_category);
        if(categoryDetails.second_parent_category.length > 1) formData.append("second_parent_category", categoryDetails.second_parent_category);
        if(categoryDetails.attribute_group.length > 0) formData.append("attribute_group", categoryDetails.attribute_group);
        if(categoryDetails.tags.length > 0) formData.append("tags", categoryDetails.tags);
        formData.append("attribute_group", categoryDetails.attribute_group);
        if(categoryDetails.tags.length) formData.append("tags", categoryDetails.tags);
        formData.append("image", categoryDetails.image);

      const url = editForm
        ? `/masterdata/category/${id}/update_record/`
        : "/masterdata/category/create_record/";

      if (editForm) {
        await API.put(url, formData);
      } else {
        await API.post(url, formData);
      }

      dispatch("newCategory");
      const action = editForm ? "Category Updated" : "Category Created";
      toast(`${action} successfully!`);
    } catch (error) {
      const action = editForm ? "Update Category" : "Create Category";
      console.log(`${action}:`, error);
      toast(`Failed to ${action}`);
    }
  }

  function handleGroupChange(selectedGroup: { value: number }) {
    categoryDetails.attribute_group = selectedGroup.value;
    selectedAttributeGroup = attributeGroups.find(
      (g: any) => g.id == selectedGroup.value
    ).name;
  }
  function handleTagChange(selectedTags: { value: number }) {
    const selectT= tags.find((g: any) => g.id == selectedTags.value)
    categoryDetails.tags.push(selectT);
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
    categoryDetails.image = imageUpload.files[0];
    const img: any = document.getElementById("selected-logo");
    img.src = window.URL.createObjectURL(image);
  }

  // Mount
  onMount(async () => {
    await fetchCategories();
    await fetchAttributeGroups();
    await fetchTags();
  });
</script>


<div class="fixed bg-background inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
    <div class="bg-white p-6 rounded-lg">
        <header class="font-bold mb-5" style="color: black">
            <h1>{editForm ? 'Update Category' : 'New Category'}</h1>
        </header>
        <main>
            <form
                    class="space-y-6 rounded pt-6 pb-8 mb-4">
                <Input bind:value={categoryDetails.name}
                       placeholder="Name"
                       class="input"/>
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
          <select class="input capitalize" bind:value={parent_category}>
            <option value="">Select Parent Category</option>
            {#each categories as category}
              <option value={""} on:click={() => handleParentCat({ value: category.id })}>
                {category.name}
              </option>
            {/each}
          </select>
          <!-- Secondary parent category -->
          <select class="input capitalize" bind:value={second_parent_category}>
            <option value="">Select secondary parent category</option>
            {#each categories as category}
              <option value={""} on:click={() => handleSecondaryParentCat({ value: category.id })}>
                {category.name}
              </option>
            {/each}
          </select>
        </div>
        <div class="items-center gap-2">
          <Select.Root  >
            <Select.Trigger class="input capitalize"
              >{selectedTags ? selectedTags : "Select a Tag"}</Select.Trigger
            >
            <Select.Content>
              <Select.Group>
                {#each tags as tag}
                  <Select.Item
                    value={tag.id}
                    label={tag.name}
                    class="capitalize"
                    on:click={() => handleTagChange({ value: tag.id })}
                  >
                    {tag.name}
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
          <img
            id="selected-logo"
            alt=""
            class={image ? "showImg" : "hideImg"}
          />
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
      </form>
    </main>
    <footer class="mt-5 flex">
      <Button type="button" class="btn mr-2 rounded" on:click={createCategory}
        >Submit</Button
      >
      <Button
        class="text-xs flex items-center gap-2 border border-red-500 bg-red-500 text-white px-4 py-1.5 rounded"
        on:click={() => dispatch("close")}
        >Cancel
      </Button>
    </footer>
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
