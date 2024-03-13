<script>
    import {  onMount } from "svelte";
    import API from "../services/api";

    async function testFetch(){
        try {
            await API.get("/inventory/batch/")
        } catch (error) {
            
        }
    }

    onMount(async() =>{
        await testFetch()
    })
</script>

<h1 class="text-emerald-600">Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
