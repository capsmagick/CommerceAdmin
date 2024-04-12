<script lang="ts">
	import { cn } from "$lib/utils.js";
	import * as Menubar from "$lib/components/ui/menubar";
	import { goto } from '$app/navigation';


	let className: string | undefined | null = undefined;
	export { className as class };

	let menus = [
    {
      name: "Dashboard",
      icon: "fa-house",
      
      items: [
        { name: "Overview", page: "dashboard" },
      ]
    },
    {
      name: "Sales",
      icon: "fa-cart-shopping",
      //route: "/orders",
      items: [
        { name: "Order Management", page: "orders" },
        { name: "Returns and Refunds", page: "returns" },
        { name: "Invoices", page: "invoices" },
      ]
    },
    {
      name: "Products",
      icon: "fa-tag",
      route: "/products",
      items: [
		{ name: "Products", page: "products" },
        { name: "Categories", page: "categories" },
        { name: "Brands", page: "brands" },
        { name: "Collection", page: "collection" },
        { name: "Lookbook", page: "lookbook" },
        { name: "Attributes", page: "attributes" },
        { name: "Attribute Group", page: "attribute-group" },
        { name: "Tag", page: "tag" },
      ]
    },
    {
      name: "Customers",
      icon: "fa-user",
      
      items: [
	    	{ name: "Customers", page: "customers" },
        { name: "Customer Group", page: "customer-group" },
        { name: "Review and Rating", page: "reviews" }
      ]
    },
     {
      name: "CMS",
      icon: "fa-users-viewfinder",
      
      items: [
	    	{ name: "Hero", page: "hero" },
      ]
    },
    {
      name: "Temporary",
      icon: "fa-users-viewfinder",
      
      items: [
	    	{ name: "tablepages", page: "tablefix" },
      ]
    },
    // {
    //   name: "Inventory",
    //   icon: "fa-warehouse",
    //   route: "/inventory",
    //   items: [
    //     { name: "inventory", page: "inventory" },
    //     { name: "batch", page: "batch" },
    //     { name: "purchase orders", page: "purchase-orders" },
    //     { name: "stock levels", page: "stock" },
    //     { name: "stock adjustments", page: "stock-adjustment" },
    //     { name: "stock transfers", page: "stock-transfer" },
    //     { name: "warehouse", page: "warehouse" },
    //   ]
    // },
    {
      name: "Reports",
      icon: "fa-file-invoice",
      //route: "/inventory",
      items: [
        { name: "Sales Report", page: "sales-report" },
        { name: "Product Report", page: "product-report" },

      ]
    },
    // Add other menu groups following the same structure
    {
      name: "Settings",
      icon: "fa-gear",
      items: [
        { name: "General Settings", page: "settings-general" },
        { name: "Payment Methods", page: "settings-payment" },
        { name: "Shipping Methods", page: "settings-shipping" },
        { name: "Tax Configuration", page: "settings-tax" },
        { name: "Admin Users", page: "settings-admin-users" },
      ]
    },
    {
      name: "Help",
      icon: "fa-circle-question",
      items: [
        { name: "Knowledge Base", page: "support-knowledge-base" },
        { name: "Contact Support", page: "support-contact" },
        { name: "System Status", page: "support-system-status" },
      ]
    },
  ];

	async function navigate(page:string) {
    await goto(page);
  }

</script>
<!-- items: [
	{ name: "Categories", page: "categories" },
	{ name: "Brands", page: "brands" },
	{ name: "Collection", page: "collection" },
	{ name: "Lookbook", page: "lookbook" },
	{ name: "Attributes", page: "attributes" },
	{ name: "Attribute Group", page: "attribute-group" },
  ] -->
<nav class={cn("flex items-center space-x-4 lg:space-x-6", className)}>
	<Menubar.Root>
		{#each menus as menu}
		  <Menubar.Menu>
			<Menubar.Trigger>{menu.name}</Menubar.Trigger>
			<Menubar.Content>
			  {#if menu.items}
				{#each menu.items as item}
				  <Menubar.Item on:click={() => navigate(`/${item.page}`)}>
					{item.name}
				  </Menubar.Item>
				{/each}
			  {:else}
			  <Menubar.Item on:click={() => navigate(menu.route ?? '')}>
				  View
				</Menubar.Item>
			  {/if}
			</Menubar.Content>
		  </Menubar.Menu>
		{/each}
	  </Menubar.Root>

</nav>