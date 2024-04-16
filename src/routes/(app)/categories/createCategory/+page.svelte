<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { toast } from "svelte-sonner";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Label } from "$lib/components/ui/label";
  import { cn } from "$lib/utils.js";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import CaretSort from "svelte-radix/CaretSort.svelte";

  const dispatch = createEventDispatcher();

  export let editData;
  export let editForm: boolean;
  let updateImage: boolean = false;

  let categoryDetails: any = {
    name: "",
    description: "",
    handle: "",
    image: "",
    is_main_menu: false,
    is_top_category: false,
    parent_category: 0,
    attribute_group: 0,
    tags: [],
  };

  let id = "";
  let tags: any = [];
  let selectedTagGroups: string;
  let attributeGroups: any = [];
  let selectedAttributeGroup: string;
  let parent_category: string = "";
  let second_parent_category: string;
  let categories: any[] = [];
  let categoryOptions:{ id:string,value: string, label: string }[] = [];
  let imageUpload: any;
  let tagNames: string[] = [];
  let attributeChange: boolean = false;

  let open: boolean = false;

  if (editForm) {
    categoryDetails = {
      name: editData.name,
      description: editData.description,
      handle: editData.handle,
      parent_category: editData.parent_category,
      is_main_menu: editData.is_main_menu,
      is_top_category: editData.is_top_category,
      image: editData.image,
      attribute_group: editData.attribute_group,
      tags: editData.tags,
    };
    id = editData.id;
    updateSelectionName();
  }

  async function updateSelectionName() {
    if (categoryDetails.parent_category) {
      await fetchCategories();
      parent_category = categories.find(
        (cat) => cat.id === categoryDetails.parent_category
      )?.name;
    }
    if (categoryDetails.second_parent_category) {
      await fetchCategories();
      second_parent_category = categories.find(
        (cat) => cat.id === categoryDetails.second_parent_category
      )?.name;
    }

    if (categoryDetails.attribute_group) {
      await fetchAttributeGroups();
      selectedAttributeGroup = attributeGroups.find(
        (group: any) => group.id === categoryDetails.attribute_group
      )?.name;
    }

    // if (categoryDetails.tags && categoryDetails.tags.length > 0) {
    //   await fetchTags();
    //   tagNames = categoryDetails.tags.map((tag) => tag.name);
    // }
  }

  async function fetchCategories() {
    try {
      const res = await API.get("/masterdata/category/");
      categories = Array.isArray(res.data?.results) ? res.data.results : [];

       categoryOptions = categories.map(category => ({
        id:category.id,
        value: category.name,
        label: category.name
      }));
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

  // async function fetchTags() {
  //   try {
  //     const res = await API.get("/masterdata/tag/");
  //     tags = res.data.results;
  //   } catch (error) {
  //     console.log("category:fetch-tags:", error);
  //   }
  // }

  async function createCategory() {
    try {
      const formData = new FormData();
      console.log("categoryDetails", categoryDetails);
      
      formData.append("name", categoryDetails.name);
      formData.append("description", categoryDetails.description);
      formData.append("handle", categoryDetails.handle);
      formData.append("is_main_menu", categoryDetails.is_main_menu);
      formData.append("is_top_category", categoryDetails.is_top_category);
      if (categoryDetails.parent_category)
        formData.append("parent_category", categoryDetails.parent_category);
      if(attributeChange){
        formData.append("attribute_group", categoryDetails.attribute_group);
      }
        formData.append("tags", categoryDetails.tags);
      // formData.append("attribute_group", categoryDetails.attribute_group);
      if (updateImage) {
        formData.append("image", categoryDetails.image);
      }
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
    attributeChange = true;
    categoryDetails.attribute_group = selectedGroup.value;
    selectedAttributeGroup = attributeGroups.find(
      (g: any) => g.id == selectedGroup.value
    ).name;
    updateSelectionName();
  }

  // function handleTagChange(selectedTags: { value: number }) {
  //   tagChange = true;
  //   selectedTagGroups = tags.find((g: any) => g.id == selectedTags.value);
  //   categoryDetails.tags = selectedTagGroups.id;
  //   updateSelectionName();
  // }

  function handleParentCat(selectedCat: { value: number }) {
    categoryDetails.parent_category = selectedCat.value;
    parent_category = categories.find(
      (g: any) => g.id == selectedCat.value
    ).name;
    console.log("Parent category name:", parent_category);
    updateSelectionName();
  }

  function handleParantCategory(){

  }

  function handleSecondaryParentCat(selectedCat: { value: number }) {
    categoryDetails.second_parent_category = selectedCat.value;
    second_parent_category = categories.find(
      (g: any) => g.id == selectedCat.value
    ).name;
    updateSelectionName();
  }

  //   Logo upload
  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    updateImage = true;
    categoryDetails.image = imageUpload.files[0];
  }

  // Mount
  onMount(async () => {
    await fetchCategories();
    await fetchAttributeGroups();
  });

  function cancelModel() {
    attributeChange = false;
    dispatch("cancel");
  }

   $: selectedParentCategory =
    categoryOptions.find((f) => f.value === id)?.label ?? "Select Parent Category";
    
 
  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }

</script>

<Dialog.Root open={true} onOpenChange={cancelModel} preventScroll={true}>
  <Dialog.Content>
    <Dialog.Header class="font-bold mb-5">
      <Dialog.Description
        >{editForm ? "Update Category" : "New Category"}</Dialog.Description
      >
    </Dialog.Header>

    <div class="mb-3">
      <Input
        bind:value={categoryDetails.name}
        placeholder="Name"
        class="input"
        type="text"
      />
    </div>
    <div class="mb-3">
      <Textarea
        bind:value={categoryDetails.description}
        placeholder="Description"
        class="textarea"
      />
    </div>

    <div class="grid grid-cols-2 gap-4 mb-3">
      <div>
        <Input
          bind:value={categoryDetails.handle}
          placeholder="Handle"
          class="input"
          type="text"
        />
      </div>
      <div>
        <Select.Root>
          <Select.Trigger class="input capitalize">
            {selectedAttributeGroup
              ? selectedAttributeGroup
              : "Select a Attribute Group"}</Select.Trigger
          >
          <Select.Content>
            <Select.Group>
              {#each attributeGroups as group}
                <Select.Item
                  value={group.id}
                  label={group.name}
                  class="capitalize card"
                  on:click={() => handleGroupChange({ value: group.id })}
                >
                  {group.name}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-3">
      <div class="mb-3">
          <Label for="parant_category">Parant Category</Label>

            <Popover.Root bind:open let:ids>
              <Popover.Trigger asChild let:builder>
                <Button
                  builders={[builder]}
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  class="w-[200px] justify-between"
                >
                  {selectedParentCategory}
                  <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </Popover.Trigger>
              <Popover.Content class="w-[200px] p-0">
                <Command.Root>
                  <Command.Input placeholder="Search category..." class="h-9" />
                  <Command.Empty>No category found.</Command.Empty>
                  <Command.Group>
                    {#each categoryOptions as category}
                      <Command.Item
                        value={category.value}
                        onSelect={(currentValue) => {
                          id = currentValue;
                          closeAndFocusTrigger(ids.trigger);
                          categoryDetails.parent_category = category.id;
                        }}
                      >
                        <Check
                          class={cn(
                            "mr-2 h-4 w-4",
                            id !== category.id && "text-transparent"
                          )}
                        />
                        {category.label}
                      </Command.Item>
                    {/each}
                  </Command.Group>
                </Command.Root>
              </Popover.Content>
            </Popover.Root>
          </div>
     
      <!-- <Select.Root>
                <Select.Trigger class="input capitalize">
                  {second_parent_category
                    ? second_parent_category
                    : "Select Secondary parent category"}
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {#each categories as category}
                      <Select.Item
                        value={category.id}
                        label={category.name}
                        class="capitalize card"
                        on:click={() =>
                          handleSecondaryParentCat({ value: category.id })}
                      >
                        {category.name}
                      </Select.Item>
                    {/each}
                  </Select.Group>
                </Select.Content>
              </Select.Root> -->
      <div class="grid grid-cols-2 gap-4 mb-3">
        <div class="mb-3">
          <Label for="mainMenu">Main Menu</Label>
          <Select.Root>
            <Select.Trigger class="input capitalize">
              {categoryDetails.is_main_menu ? "Yes" : "No"}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Item
                  value={true}
                  label="Yes"
                  class="capitalize card"
                  on:click={() => (categoryDetails.is_main_menu = true)}
                >
                  Yes
                </Select.Item>
                <Select.Item
                  value={false}
                  label="No"
                  class="capitalize card"
                  on:click={() => (categoryDetails.is_main_menu = false)}
                >
                  No
                </Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <div class="mb-3">
          <Label for="Topcategory">Top Category</Label>
          <Select.Root>
            <Select.Trigger class="input capitalize">
              {categoryDetails.is_top_category ? "Yes" : "No"}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Item
                  value={true}
                  label="Yes"
                  class="capitalize card"
                  on:click={() => (categoryDetails.is_top_category = true)}
                >
                  Yes
                </Select.Item>
                <Select.Item
                  value={false}
                  label="No"
                  class="capitalize card"
                  on:click={() => (categoryDetails.is_top_category = false)}
                >
                  No
                </Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </div>

    <!-- <div class="items-center gap-2 mb-3">
        <Select.Root>
                <Select.Trigger class="input capitalize">
                  {tagNames
                    ? tagNames
                    : "Select a Tag"}</Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {#each tags as tag}
                      <Select.Item
                        value={tag.id}
                        label={tag.name}
                        class="capitalize card"
                        on:click={() => handleTagChange({ value: tag.id })}>
                        {tag.name}
                      </Select.Item>
                    {/each}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
      </div> -->
    <div class="flex justify-between mb-2">
      <Button
        type="button"
        class="btn flex gap-2 items-center bg-indigo-500 text-white text-xs"
        on:click={pickAvatar}
        ><i class="fa-solid fa-image text-sm"></i>Upload category image
      </Button>
      <img
        id="selected-logo"
        alt=""
        class={categoryDetails.image ? "showImg" : "hideImg"}
        src={updateImage
          ? window.URL.createObjectURL(categoryDetails.image)
          : categoryDetails.image}
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

    <Dialog.Footer>
      <Button type="button" variant="ghost" on:click={cancelModel}
        >Cancel
      </Button>

      <Button type="button" on:click={createCategory}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

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
