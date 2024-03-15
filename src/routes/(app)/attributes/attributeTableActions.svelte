<script lang="ts">
    import { MoreHorizontal } from "lucide-svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
    import CreateAttribute from "./createattributes/+page.svelte";
    import API from "$lib/services/api";
    import { toast } from "svelte-sonner";
    import {onMount} from "svelte";

    interface Attribute {
    id: string;
    name: string; 
    value: string[];
    }


    export let id: string;





    let showDeleteModal = false;
    let deletingAttribute:Attribute;

    let attributes: any[] = [];
    let editData: any = null;
    let showForm: boolean = false;
    let editForm: boolean = false;

    // Edit Attribute
    async function onEditAttribute(attribute: any) {
        editData = attribute;
        showForm = true;
        editForm = true;        
    }

    async function onDeleteAttribute(attribute: { id: string; name: string }) {
    deletingAttribute = attribute;
    showDeleteModal = true;
    }

    

  // Ensure this is initialized as an array

  async function getAttributes() {
      try {
          const res = await API.get("/masterdata/attribute/");
          // Ensure attributes is always an array, even if res.data or res.data.results is undefined
          attributes = Array.isArray(res.data?.results) ? res.data.results : [];
      } catch (error) {
          console.error("Error fetching attributes:", error);
          attributes = []; // Ensure attributes is reset to an empty array in case of an error
      }
  }

    function confirmDelete() {
        API.delete(`/masterdata/attribute/${deletingAttribute.id}/delete_record/`).then(() => {
            getAttributes();
            closeDeleteModal();
        }).catch((error) => {
            console.error("Error deleting attribute:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        toast("Attribute Deleted Successfully!");
    }
    onMount(async () => {
    await getAttributes();
    });
  </script>

  <div class="m-3">
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingAttribute.name} on:confirm={confirmDelete} on:cancel={closeDeleteModal}/>
    {/if}

    {#if showForm}
        <CreateAttribute
                on:close={() => {
                editData = null;
                editForm = false;
                showForm = false;
                }}
                on:newAttribute={() => {
                editData = null;
                editForm = false;
                showForm = false;
                getAttributes();
            }}
                {editData}
                {editForm}
        />
    {/if}
    </div>  
   
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <Button
        variant="ghost"
        builders={[builder]}
        size="icon"
        class="relative h-8 w-8 p-0"
      >
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item
        class="text-gray-700"
        on:click={() => onEditAttribute(id)}>
          <i class="fa-solid fa-pencil"></i>
      </DropdownMenu.Item>
      <DropdownMenu.Item
        on:click={() => onDeleteAttribute(id)}
        class="text-red-500">
          <i class="fa-solid fa-trash"></i>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>