<script lang="ts">
  import API from "$lib/services/api";
  import CreateHero from './createHero/+page.svelte';
  import { Button } from "$lib/components/ui/button";
  import AttributeGroupTable from "./attributeGroupTable.svelte";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import {toast} from "svelte-sonner";

    let showDeleteModal = false;
    let deletingAttributeGroup: any;
    let refreshTable;
    let editData;
    let showForm: boolean = false;
    let editForm: boolean = false;

    function toggleForm() {
        console.log(showForm)
        showForm = !showForm
    }

    // Edit Attribute
    async function onEditAttributeGroup(eventData) {
        editData = eventData.original;
        showForm = true;
        editForm = true;
    }

    async function onDeleteAttributeGroup(eventData) {
        deletingAttributeGroup = eventData.original;
        showDeleteModal = true;
    }

    function confirmDelete() {
        API.delete(`/masterdata/attributegroup/${deletingAttributeGroup.id}/delete_record/`).then(() => {
            closeDeleteModal();
            toast("Attribute Group Deleted Successfully!");
        }).catch((error) => {
            console.error("Error deleting AttributeGroup:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshTable.refreshTable();
    }

    function handleNewAttributeGroup() {
        editData = null;
        editForm = false;
        showForm = false;
        refreshTable.refreshTable();
    }

</script>

<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingAttributeGroup.name} on:confirm={confirmDelete}
                            on:cancel={closeDeleteModal}/>
    {/if}
</div>

<div class="abc">
    {#if showForm}
        <CreateHero
                {editData}
                {editForm}
                on:cancel={() => {editData = null;editForm = false;showForm = false;}}
                on:newAttributeGroup={() => handleNewAttributeGroup()}/>
    {/if}
</div>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
    <div class="flex items-center ">
        <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Hero Section</h4>
        <div class="glow-border mr-4">
            <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={() => toggleForm()}>
                <span>
                    <i class="fa-solid fa-plus text-sm"></i>
                </span>New Hero Section
            </Button>
        </div>
    </div>
    <AttributeGroupTable on:newAttributeGroup={() => toggleForm()}
                on:edit={(event) => onEditAttributeGroup(event.detail.item.row)}
                on:delete={(event) => onDeleteAttributeGroup(event.detail.item.row)}
                bind:this={refreshTable}/>
</div>