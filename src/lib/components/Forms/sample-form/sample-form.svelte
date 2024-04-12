<script lang="ts">
  import { onMount } from "svelte";
    import * as Dialog from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import type { CategoriesType, attributeGroup } from "$lib/types/types";
  import Check from "svelte-radix/Check.svelte";
  import CaretSort from "svelte-radix/CaretSort.svelte";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { cn } from "$lib/utils.js";
  import { writable } from 'svelte/store';
  import { Checkbox } from "$lib/components/ui/checkbox";
  import Label from "$lib/components/ui/label/label.svelte";

  export const categoriesStore = writable<CategoriesType[]>([]);

 
  let open = false;
  let id = "";
  let uploading = false; // Add this line to define 'uploading'
  let uploadProgress = 0;
  export let categoryID: string = "";
  export let isUpdate: boolean = false;

 // export let editForm: boolean = false;
 




  export let categoryDetails: CategoriesType = {
            id:"",
            tags: [],
            sub_category: [],
            created_at: "",
            updated_at: "",
            deleted: false,
            deleted_at: "",
            name: "",
            description: "",
            handle: "",
            is_active: false,
            image: "",
            is_main_menu: false,
            is_top_category: false,
            created_by: "",
            updated_by: "",
            deleted_by: "",
            parent_category:"",
            attribute_group: ""
  };

  let categories: CategoriesType[] = [];
  let selectedAttributeGroup: string;
  let imageUpload: HTMLInputElement;
  let parent_category: string = "";

  
  let attributeGroups: attributeGroup[] = [];
  let categoryOptions: { id:string,value: string, label: string }[] =[
  
  ]

  export async function loadData(){

    if(isUpdate == true && categoryID.length > 0){
      const res = await API.get(`/masterdata/category/${categoryID}`);
      categoryDetails = res.data.results;
    }
    try {
      const res = await API.get("/masterdata/attributegroup/");
      attributeGroups = res.data.results;
    } catch (error) {
      console.log("category:fetch-attribute-group:", error);
    }
    await fetchCategories();
  
  }
  async function fetchCategories() {
    try {
      const res = await API.get("/masterdata/category/");
      categories = Array.isArray(res.data?.results) ? res.data.results : [];
      // Populate frameworks with category data in the desired format
       categoryOptions = categories.map(category => ({
        id:category.id,
        value: category.name,
        label: category.name
      }));
     
      console.log("categoryOption",categoryOptions);
      categoriesStore.set(categories);
    } catch (error) {
      console.log("category:fetch-category:", error);
    }
  }
  let UploadedimageURL = ""


  async function uploadAvatar() {
    uploading = true;
    uploadProgress = 0;


  if (imageUpload.files && imageUpload.files.length > 0) {
    const file = imageUpload.files[0];
    categoryDetails.image = file;
    
    
    uploadProgress = 100;
    UploadedimageURL = URL.createObjectURL(file);
    
    uploading = false;
    // Now you can use 'file' as a Blob to upload or process further
    // Example: console.log(file.name);
  }
}


async function createCategory() {

  const formData = new FormData();
      formData.append("name", categoryDetails.name);
      formData.append("description", categoryDetails.description);
      formData.append("handle", categoryDetails.handle);
      formData.append("is_main_menu", categoryDetails.is_main_menu.toString());
      formData.append("is_top_category", categoryDetails.is_top_category.toString());

      if (categoryDetails.parent_category)
            formData.append("parent_category", categoryDetails.parent_category);

      if (categoryDetails.attribute_group && categoryDetails.attribute_group.length > 0)
        formData.append("attribute_group", categoryDetails.attribute_group);

      if (categoryDetails.image instanceof File) {
      formData.append('image', categoryDetails.image, categoryDetails.image.name);
    }

  try {

    let response:Response;
    const url = isUpdate
        ? `/masterdata/category/${id}/update_record/`
        : "/masterdata/category/create_record/";

      if (isUpdate) {
       response = await API.put(url, formData);
      } else {
        response = await API.post(url, formData);
      }

      if(response.status === 200 || response.status === 201){
        console.log("Category created successfully");
      

      }else{
        console.log("Failed to create category:" + response.status);
      }
    
  } catch (error) {
    console.error('Error creating category:', error);
  
  }
}
  
  onMount(async () => {
   await loadData();
    
  });
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
   
  <Dialog.Root>
    <Dialog.Trigger><Button  class=" glow-border-content bg-background text-foreground" >
      
      Create New
    </Button></Dialog.Trigger >
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Create New</Dialog.Title>
        <Dialog.Description>
          
        
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
                      on:click={() =>  {
                        categoryDetails.attribute_group = group.id;
                         selectedAttributeGroup = group.name;
                        }}>
                      {group.name}
                    </Select.Item>
                  {/each}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-3">
            <div class="mb-3">
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
            <div class="flex ml-10 items-center mb-3">
              <Checkbox id="terms" bind:checked={categoryDetails.is_top_category} />
              <Label
                for="is_top_category"
                class="text-sm ml-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Is it a top category?
              </Label>
            </div>
          </div>
          <div class="grid grid-cols-2  gap-4 mb-3">
            <div class="flex ml-10 items-center mb-3">
              <Checkbox id="terms" bind:checked={categoryDetails.is_main_menu} />
              <Label
                for="is_top_category"
                class="text-sm ml-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Is it in top navigation?
              </Label>
            </div>
            <div class="flex ml-10 items-center mb-3">
              <Button
              type="button"
              class="flex gap-2 items-center text-xs"
              on:click={() => imageUpload.click()}
            >
              <i class="fa-solid fa-image text-sm"></i>Upload category image
            </Button>
            <input type="file" class="hidden" bind:this={imageUpload} on:change={uploadAvatar} accept="image/*" />
            </div>
          </div>
          <div class="grid grid-cols-2  gap-4 mb-3">
            <div class="flex ml-10 items-center mb-3">
              {#if categoryDetails.image}
              <img src={UploadedimageURL} alt="" class="w-20 h-20 object-cover" />
            {/if}
            
            {#if uploading}
              <progress value={uploadProgress} max="100" class="w-full"></progress>
              <p>Uploading: {uploadProgress}%</p>
            {/if}
            
            </div>
            <div class="flex ml-10 items-center mb-3">
            
            </div>
          </div>
         
           
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <div class="grid grid-cols-2  gap-4 mb-3">
          <Button
          type="button"
          variant="ghost"
          >Cancel
        </Button>

        <Button type="button" on:click={createCategory}>Save</Button>
         
        </div>
      </Dialog.Footer>
    <Dialog.Close/>
    </Dialog.Content>
  </Dialog.Root>