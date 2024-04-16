<script lang="ts">
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import AdminTable from "./adminTable.svelte";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import {toast} from "svelte-sonner";

    let showDeleteModal = false;
    let deletingAdmin: any;
    let refreshTable:any;
    let editData:any;
    let showForm: boolean = false;
    let editForm: boolean = false;

    function toggleForm() {
        showForm = !showForm
    }

    // Edit Attribute
    async function onEditAdmin(eventData:any) {
        editData = eventData.original;
        showForm = true;
        editForm = true;
    }

    async function onDeleteAdmin(eventData:any) {
        deletingAdmin = eventData.original;
        showDeleteModal = true;
    }

    function confirmDelete() {
        API.delete(`/account/manager/${deletingAdmin.id}/delete_record/`).then(() => {
            closeDeleteModal();
            toast("Admin Deleted Successfully!");
        }).catch((error) => {
            console.error("Error deleting AttributeGroup:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshTable.refreshTable();
    }

</script>

<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingAdmin.name} on:confirm={confirmDelete}
                            on:cancel={closeDeleteModal}/>
    {/if}
</div>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
    <div class="flex items-center ">
        <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Admin Users</h4>
        <div class="glow-border mr-4">
            <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={() => toggleForm()}>
                <span>
                    <i class="fa-solid fa-plus text-sm"></i>
                </span>New Admin
            </Button>
        </div>
    </div>
    <AdminTable
                on:edit={(event) => onEditAdmin(event.detail.item.row)}
                on:delete={(event) => onDeleteAdmin(event.detail.item.row)}
                bind:this={refreshTable}/>
</div>