<script lang="ts">
    /** @type {import('./$types').PageData} */
    import API from "$lib/services/api";
    import CreditBrand from "./createBrand/+page.svelte";
    import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
    import {toast} from "svelte-sonner";
    import BrandTable from "./brandTable.svelte";

    let showDeleteModal = false;
    let deletingBrand: any;
    let refreshTable;
    let editData;
    let showForm: boolean = false;
    let editForm: boolean = false;

    function toggleForm() {
        console.log(showForm)
        showForm = !showForm
    }

    // Edit Attribute
    async function onEditBrand(eventData) {
        editData = eventData.original;
        showForm = true;
        editForm = true;
    }

    async function onDeleteBrand(eventData) {
        deletingBrand = eventData.original;
        showDeleteModal = true;
    }

    function confirmDelete() {
        API.delete(`/masterdata/brand/${deletingBrand.id}/delete_record/`).then(() => {
            closeDeleteModal();
        }).catch((error) => {
            console.error("Error deleting Brand:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshTable.refreshTable();
        toast("Brand Deleted Successfully!");
    }

    function handleNewBrand() {
        editData = null;
        editForm = false;
        showForm = false;
        refreshTable.refreshTable();
    }

</script>
<div class="m-3">
    <div>
        {#if showDeleteModal}
            <ConfirmDeleteModal attribute={deletingBrand.name} on:confirm={confirmDelete}
                                on:cancel={closeDeleteModal}/>
        {/if}
    </div>

    <div class="abc">
        {#if showForm}
            <CreditBrand
                    {editData}
                    {editForm}
                    on:close={() => {editData = null;editForm = false;showForm = false;}}
                    on:newBrand={() => handleNewBrand()}/>
        {/if}
    </div>


    <BrandTable on:newBrand={() => toggleForm()}
                on:edit={(event) => onEditBrand(event.detail.item.row)}
                on:delete={(event) => onDeleteBrand(event.detail.item.row)}
                bind:this={refreshTable}/>
</div>