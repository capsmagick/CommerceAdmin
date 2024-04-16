<script lang="ts">
import * as Tabs from "$lib/components/ui/tabs/index.js";
import Profile from "./profile/+page.svelte";
import Admin from "./admin/+page.svelte";
import Payment from "./payment/+page.svelte"
import Shipping from "./shipping/+page.svelte"

let profile = true;
let admin = false;

let items = [{  title: "Profile", status: true }, { title: "Admin", status: false }];

function viewProfile() {
	profile = true;
	admin = false;
}

function viewAdmin() {
  profile = false;
  admin = true;
}

</script>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex h-screen mt-3">
    <div class="container justify-center">
      <Tabs.Root align="center" justify="center">
        <Tabs.List>
          <Tabs.Trigger value="profile">Profile Settings</Tabs.Trigger>
          <Tabs.Trigger value="admin">Admin Settings</Tabs.Trigger>
          <Tabs.Trigger value="payment">Payment Method</Tabs.Trigger>
          <Tabs.Trigger value="shipping">Shipping Method</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="profile">
          <Profile />
        </Tabs.Content>
        <Tabs.Content value="admin">
          <Admin />
        </Tabs.Content>
        <Tabs.Content value="payment">
          <Payment />
        </Tabs.Content>
        <Tabs.Content value="shipping">
          <Shipping />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  </div>
</div>


