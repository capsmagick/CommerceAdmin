<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { toast } from "svelte-sonner";
  import * as Card from "$lib/components/ui/card";

  const dispatch = createEventDispatcher();

  
  export let editForm: boolean;
  let updateImage: boolean = false
  type Categories = {
    id: string;
    name: string;
    handle:string;
    description: string;
    tags: string[]; // Corrected type
    image: string;
    status: string[];
    attribute_group: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    parent_category: string;
    is_top_category: boolean;
    is_main_menu: boolean;
  };

  let categoryDetails: Categories = {
    id:"",
    name: "",
    handle:"",
    description:"",
    tags: [""], // Corrected type
    image: "",
    status:[""],
    attribute_group:"",
    created_at:"",
    updated_at: "",
    created_by: "",
    updated_by: "",
    parent_category:"",
    is_top_category: false,
    is_main_menu: false,
  };
  export let editData :Categories;

  let id = "";
  let tags: any = [];
  let selectedTagGroups: string;
  let selectedAttributeGroup: string;
  let parent_category: string = "";
  let attributeGroups: Record<string, any>[] = [];
  let categories: any[] = [];
  let imageUpload: any;
  let tagChange: boolean = false

  if (editForm) {
    categoryDetails = {
    id: editData.id,
    name: editData.name,
    description: editData.description,
    handle: editData.handle,
    parent_category: editData.parent_category,
    is_main_menu: editData.is_main_menu,
    is_top_category: editData.is_top_category,
    image: editData.image,
    attribute_group: editData.attribute_group,
    tags: editData.tags,
    status: editData.status,
    created_at: editData.created_at,
    updated_at: editData.updated_at,
    created_by: editData.created_by,
    updated_by: editData.updated_by,
  };
    id = editData.id;
    updateSelectionName();
  }

  async function updateSelectionName(){
    if (categoryDetails.parent_category){
      await fetchCategories();
      parent_category = categories.find(cat => cat.id === categoryDetails.parent_category)?.name;
    }
    if (categoryDetails.attribute_group) {
      await fetchAttributeGroups();
      selectedAttributeGroup = attributeGroups.find(group => group.id === categoryDetails.attribute_group)?.name;
    }

   
  }

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
      
      formData.append("name", categoryDetails.name);
      formData.append("description", categoryDetails.description);
      formData.append("handle", categoryDetails.handle);
      formData.append("is_main_menu", categoryDetails.is_main_menu.toString());
      formData.append("is_top_category", categoryDetails.is_top_category.toString());
      if (categoryDetails.parent_category)
            formData.append("parent_category", categoryDetails.parent_category);
      if (categoryDetails.attribute_group.length > 0)
        formData.append("attribute_group", categoryDetails.attribute_group);
      if (updateImage){
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
    tagChange = false
    dispatch("cancel");
  }
  function handleClickOutside(event:any) {
    if (!event.target.closest(".card")) {
      cancelModel();
    }
  }

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


<div
  class="fixed bg-background inset-0 flex items-center justify-center"
  style="background-color: rgba(0, 0, 0, 0.5);">
  <div class="flex items-center justify-center">
    <div class="glow-border">
      <div class="card glow-border-content bg-background text-foreground">
        <Card.Root class="p-6 rounded-lg">
          <Card.Header class="font-bold mb-5">
            <Card.Title
              >{editForm ? "Update Category" : "New Category"}</Card.Title
            >
          </Card.Header>
          <Card.Content>
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
              <Input
                bind:value={categoryDetails.handle}
                placeholder="Handle"
                class="input"
                type="text"
                />
              <Select.Root>
                <Select.Trigger class="input capitalize">
                  {selectedAttributeGroup
                    ? selectedAttributeGroup
                    : "Select a Attribute Group"}</Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {#each attributeGroups as group}
                      <Select.Item
                        value={group.id}
                        label={group.name}
                        class="capitalize card"
                        on:click={() => categoryDetails.attribute_group = group.id}>
                        {group.name}
                      </Select.Item>
                    {/each}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-3">
              <div class="mb-3">
              <label for="mainMenu">Parent Category</label>
              <Select.Root>
                <Select.Trigger class="input capitalize">
                  {parent_category ? parent_category : "Select Parent Category"}
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {#each categories as category}
                      <Select.Item
                        value={category.id}
                        label={category.name}
                        class="capitalize card"
                        on:click={() => categoryDetails.parent_category = category.id}>
                        {category.name}
                      </Select.Item>
                    {/each}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-3">
              <div class="mb-3">
                <label for="mainMenu">Main Menu</label>
              <Select.Root>
                <Select.Trigger class="input capitalize">
                  {categoryDetails.is_main_menu ? "true" : "false"}
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    <Select.Item
                      value={true}
                      label="Yes"
                      class="capitalize card"
                      on:click={() => categoryDetails.is_main_menu = true}>
                      Yes
                    </Select.Item>
                    <Select.Item
                      value={false}
                      label="No"
                      class="capitalize card"
                      on:click={() => categoryDetails.is_main_menu = false}>
                      No
                    </Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
            <div class="mb-3">
              <label for="Topcategory">Top Category</label>
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
                    on:click={() => categoryDetails.is_top_category = true}>
                    Yes
                  </Select.Item>
                  <Select.Item
                    value={false}
                    label="No"
                    class="capitalize card"
                    on:click={() => categoryDetails.is_top_category = false}>
                    No
                  </Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
            </div>
            <div class="flex items-center justify-evenly gap-2">
              <Button
                type="button"
                class="btn flex gap-2 items-center bg-indigo-500 text-white text-xs"
                on:click={pickAvatar}
                ><i class="fa-solid fa-image text-sm"></i>Upload category image
              </Button>
         
            </div>

            <!-- Assuming Select component exists and can handle multiple selections -->
          </Card.Content>
          <Card.Footer class="justify-between space-x-2">
            <Button
              type="button"
              variant="ghost"
              on:click={() => dispatch("cancel")}
              >Cancel
            </Button>

            <Button type="button" on:click={createCategory}>Save</Button>
          </Card.Footer>
        </Card.Root>
      </div>
    </div>
  </div>
</div>