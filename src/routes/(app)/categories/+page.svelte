<script lang="ts">
  /** @type {import('./$types').PageData} */
  import { onMount } from "svelte";
  import { goto } from "$app/navigation"
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import CategoriesTable from "./categoriesTable.svelte";
  //
  export let data;
  let categories: { id: string; name: string; handle: string; description: string }[] = [];
  let showForm = false;

  //
  async function fetchCategories() {
    try {
      const res = await API.get("/masterdata/category/");
      categories = Array.isArray(res.data?.results) ? res.data.results : []
    } catch (error) {
      console.log("fetch:categories:", error);
      categories = []
    }
  }
  async function onDeleteCategory(category: { id: string }) {
    try {
      await API.delete(`/masterdata/category/${category.id}/delete_record/`);
    } catch (error) {
      console.log("delete:category:", error);
    }
  }

  //   Mount
  onMount(async () => {
    await fetchCategories();
  });
</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border" style="height: calc(100vh - 80px);">
  <div class="flex items-center justify-between">
      <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200">Category</h4>
      <Button variant="outline" class=" mr-4  ">Export Category</Button>
  </div>
  <CategoriesTable/>
</div>
