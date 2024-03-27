<script lang="ts">
    import {Input} from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import {Textarea} from "$lib/components/ui/textarea";
    import {Select} from "$lib/components/ui/select";
    import {Button} from "$lib/components/ui/button";
    import API from "$lib/services/api";
    import {createEventDispatcher, onMount} from "svelte";
    import {toast} from "svelte-sonner";
    import * as Card from "$lib/components/ui/card";

    const dispatch = createEventDispatcher();

    export let editData;
    export let editForm;

    let variantDetails = {
        name: "",
        stock: "",
        selling_price: "",
        attributes: "",
        product:""
    };
    let id = "";

    if (editForm) {
        variantDetails = {
            name: editData.name,
            stock: editData.stock,
            selling_price: editData.selling_price,
            attributes: editData.attributes,
            product: editData.product,
        };
        id = editData.id;
    }


    async function createVariant() {
        try {
            const form = new FormData();
            form.append("stock", variantDetails.stock);
            form.append("name", variantDetails.name);
            form.append("selling_price", variantDetails.selling_price);
            form.append("attributes", variantDetails.attributes);
            form.append("product", variantDetails.product);

            const url = editForm ? `/products/variant/${id}/update_record/` : "/products/variant/create_record/";

            if (editForm) {
                await API.put(url, form);
            } else {
                await API.post(url, form);
            }

            dispatch("newVariant");
            const action = editForm ? "Variant Updated" : "Variant Created";
            toast(`${action} successfully!`);
        } catch (error) {
            const action = editForm ? "Update Variant" : "Create Variant";
            console.log(`${action}:`, error);
            toast(`Failed to ${action}`);
        }
    }

        function cancelModel() {
    dispatch('close');
  }
    function handleClickOutside(event) {
    if (!event.target.closest('.card')) {
      cancelModel();
    }
  }
  
onMount(() => {
  const timeout = setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  }, 100);

    return () => {
    clearTimeout(timeout);
    document.removeEventListener('click', handleClickOutside);
  };
});
</script>

<div class="fixed bg-background inset-0 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
   <div class="flex items-center justify-center">
       <div class="glow-border">
           <div class="card glow-border-content bg-background text-foreground overflow-y-auto" style="max-height:90vh;">
                <Card.Root class="bg-white p-6 rounded-lg">
                    <Card.Header class="font-bold mb-5" style="color: black">
                        <Card.Title>{editForm ? 'Update Variant' : 'New Variant'}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                            <div class="mb-3">
                                <Label for="name">Name</Label>
                                <Input id="name" bind:value={variantDetails.name} placeholder="Name" class="input"/>
                            </div>
                           
                            <div class="mb-3">
                                <Label for="stock">Stock</Label>
                                <Textarea id="stock" bind:value={variantDetails.stock} placeholder="Stock" class="textarea"/>
                            </div>

                            <div class="mb-3">
                                <Label for="selling_price">Selling Price</Label>
                                <Textarea id="selling_price" bind:value={variantDetails.selling_price} placeholder="Selling Price" class="textarea"/>
                            </div>

                            <div class="mb-3">
                                <Label for="attributes">Attributes</Label>
                                <Textarea id="attributes" bind:value={variantDetails.attributes} placeholder="Attributes" class="textarea"/>
                            </div>

                            <div class="mb-3">
                                <Label for="product">Product</Label>
                                <Textarea id="product" bind:value={variantDetails.product} placeholder="Product" class="textarea"/>
                            </div>

                    </Card.Content>
                    <Card.Footer  class="justify-between space-x-2">
                        <Button type="button" variant="ghost" on:click={() => dispatch("close")}>Cancel</Button>
                        <Button type="submit"  on:click={createVariant}>Save</Button>
                    </Card.Footer>
                </Card.Root>
           </div>
       </div>
   </div>
</div>

    <style>
      .card::-webkit-scrollbar {
    display: none;
}
    </style>