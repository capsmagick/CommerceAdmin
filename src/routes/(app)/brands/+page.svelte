<script lang="ts">
    /** @type {import('./$types').PageData} */
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import API from "$lib/services/api";
    import {Button} from "$lib/components/ui/button";
    import CreditBrand from "./createBrand/+page.svelte";
    import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
    import {toast} from "svelte-sonner";
    import BrandTable from "./brandTable.svelte";
    import Oldcode from "./oldcode.svelte";

    let showDeleteModal = false;
    let deletingBrand;
  
    let brands: any[] = [];
    let editData: any = null;
    let showForm: boolean = false;
    let editForm: boolean = false;

    function toggleForm() {
        console.log(showForm)
        showForm = !showForm
    }

    async function getBrands() {
        try {
            const res = await API.get("/masterdata/brand/");
            brands = Array.isArray(res.data?.results) ? res.data.results : [];
        } catch (error) {
            console.error("Error fetching attributes:", error);
            brands = []; // Ensure attributes is reset to an empty array in case of an error
        }
    }

    // Edit Attribute
    async function onEditBrand(brand: any) {
        editData = brand;
        showForm = true;
        editForm = true;
    }

    async function onDeleteBrand(brand: { id: number }) {
        deletingBrand = brand;
        showDeleteModal = true;
    }

    function confirmDelete() {
        API.delete(`/masterdata/brand/${deletingBrand.id}/delete_record/`).then(() => {
            getBrands();
            closeDeleteModal();
        }).catch((error) => {
            console.error("Error deleting Brand:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        toast("Brand Deleted Successfully!");
    }

    onMount(async () => {
        await getBrands();
    });
</script>

<div class="m-3">
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingBrand.name} on:confirm={confirmDelete} on:cancel={closeDeleteModal}/>
    {/if}

    {#if showForm}
        <CreditBrand
                on:close={() => {
                editData = null;
                editForm = false;
                showForm = false;
                }}
                on:newBrand={() => {
                editData = null;
                editForm = false;
                showForm = false;
                getBrands();
            }}
                {editData}
                {editForm}
        />
    {/if}
    <div
            class="bg-white rounded-md p-4 px-6 border overflow-y-auto"
            style="height: calc(100vh - 58px);"
    >
        <div>
            <div class="flex items-center justify-between">
                <h4 class="text-lg font-medium text-gray-800">Brands</h4>
                <div class="flex items-center gap-2">
                    <Button
                            class="text-xs flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-1.5 rounded"
                            on:click={() => toggleForm()}>
                        <i class="fa-solid fa-plus text-sm"></i>
                        New Brand
                    </Button>
                </div>
            </div>
        </div>
        <!-- table -->
        <div class="mt-8 flow-root">
            <div class=" overflow-x-auto">
                <div
                        class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
                >
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead>
                        <tr>
                            <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                            >Name
                            </th
                            >
                            <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >Logo
                            </th
                            >
                            <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >Description
                            </th
                            >
                            <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                            </th
                            >
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                        {#each brands as brand, i}
                            <tr>
                                <td
                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 capitalize"
                                >{brand.name}</td
                                >
                                <td
                                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                >{brand.logo}</td
                                >
                                <td
                                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                >{brand.description}</td
                                >
                                <td
                                        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex gap-2 items-center"
                                >
                                    <Button class="text-gray-700"
                                            on:click={() => onEditBrand(brand)}
                                    >
                                        <i class="fa-solid fa-pencil"></i>
                                    </Button>
                                    <Button
                                            class="text-red-500"
                                            on:click={() => onDeleteBrand(brand)}
                                    >
                                        <i class="fa-solid fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
