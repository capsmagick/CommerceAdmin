<script>
    import "../../app.css";
    import SideBar from "$lib/components/SideBar.svelte";
    import Header from "$lib/components/Header.svelte";
</script>
<div class="relative min-h-screen w-full  bg-white text-black dark:bg-gray-900 dark:text-gray-200">
    <aside class="fixed left-0 top-0 h-full bg-gray-50 w-[250px]">
        <SideBar/>
    </aside>
    <div class="pl-[250px]">
        <Header />
        <main class=" bg-white text-black dark:bg-gray-900 dark:text-gray-200">
            <slot />
        </main>
    </div>
</div>