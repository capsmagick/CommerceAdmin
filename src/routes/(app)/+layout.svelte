<script>
    import "../../app.css";
    import SideBar from "$lib/components/SideBar.svelte";
    import Header from "$lib/components/Header.svelte";
  
</script>
<div class="relative min-h-screen w-full  bg-background text-foreground">
    <!-- <aside class="fixed left-0 top-0 h-full bg-gray-50 w-[250px]">
        <SideBar/>
    </aside> -->
    <div class="">
        <Header />
       
        <main  class="bg-background text-foreground">
            <slot />
        </main>
    </div>
    
</div>