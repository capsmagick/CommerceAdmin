<script lang="ts">

	import Download from "lucide-svelte/icons/download";
	import { Button } from "$lib/components/ui/button";
	import * as Tabs from "$lib/components/ui/tabs";
	import DatePickerWithRange from "$lib/components/ui/date-picker-with-range.svelte";
	// import DashboardLight from "$lib/img/examples/dashboard-light.png";
	// import DashboardDark from "$lib/img/examples/dashboard-dark.png";
	import OverviewPage from "./overview/+page.svelte"
	import Sales from "./sales/+page.svelte";
	import Analytics from "./analytics/+page.svelte";
	import Orders from "./orders/+page.svelte";
	import Reports from "./reports/+page.svelte";
</script>


<div class="hidden flex-col md:flex">
	<div class="flex-1 space-y-4 p-8 pt-6">
		<div class="flex items-center justify-between space-y-2">
			<h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
			<div class="flex items-center space-x-2">
				<DatePickerWithRange />
				<Button size="sm">
					<Download class="mr-2 h-4 w-4" />
					Download
				</Button>
			</div>
		</div>
		<Tabs.Root value="overview" class="space-y-4">
			<Tabs.List>
				<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
				<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
				<Tabs.Trigger value="reports">Reports</Tabs.Trigger>
				<Tabs.Trigger value="orders">Orders</Tabs.Trigger>
				<Tabs.Trigger value="sales">Sales</Tabs.Trigger>
			</Tabs.List>
			<OverviewPage />
			<Reports />
			<Analytics />
			<Orders />
			<Sales />
		</Tabs.Root>
	</div>
</div>