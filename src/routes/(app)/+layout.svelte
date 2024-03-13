<script>
    import "../../app.css";
    import SideBar from "$lib/components/SideBar.svelte";
    import Header from "$lib/components/Header.svelte";
</script>
<div class="relative min-h-screen w-full bg-slate-200">
    <aside class="fixed left-0 top-0 h-full bg-gray-50 w-[250px]">
        <SideBar/>
    </aside>
    <div class="pl-[250px]">
        <Header />
        <main>
            <slot />
        </main>
    </div>
</div>