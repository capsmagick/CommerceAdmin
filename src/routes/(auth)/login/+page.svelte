<script lang="ts">
  import { UserStore } from "$lib/stores/data";
  import '../../../app.css';
  import logo from '$lib/images/SIGNUP_LOGO.png';

  import API from "$lib/services/api";
  import { goto } from "$app/navigation";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import Sun from "svelte-radix/Sun.svelte";
  import Moon from "svelte-radix/Moon.svelte";
  import { toggleMode } from "mode-watcher";
  let login = {
    username: "",
    password: "",
  };

  let Logo =logo;

  async function loginFn(params: any) {
  try {
    const res = await API.post("/account/session/user/login/", {
      ...login,
    });

    // Check if res and res.data are defined
    if (!res || !res.data) {
      console.error("Invalid response from the server");
      return; // Exit the function if the response is not valid
    }

    const user = res.data.user;

    // Additional check for user object
    if (user && user.username) {
      UserStore.set(user);
      await goto('/dashboard'); // Navigate to the dashboard
    } else {
      console.error("User data is missing in the response");
    }
  } catch (error) {
    console.log("login:", error);
  }
}
</script>
<Button on:click={toggleMode} variant="outline" size="icon">
  <Sun
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
  />
  <Moon
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
  />
  <span class="sr-only">Toggle theme</span>
</Button>
<div class="flex min-h-full flex-col bg-background text-foreground justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img class="mx-auto h-22 w-auto dark:invert" src={Logo} alt="Signup Casuals">
    <!-- <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2> -->
  </div>

  <div class="mt-10 sm:mx-auto bg-background text-foreground sm:w-full sm:max-w-sm">
    <form class="space-y-6" >
      <div>
        <label for="username" class="block bg-background text-foreground  text-sm font-medium leading-6">User Name</label>
        <div class="mt-2">
          <Input  id="username" bind:value={login.username} name="username" placeholder="Username" autocomplete="username" required class="block w-full pl-4  rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6">
          </Input>
          </div>
      </div>

      <div>
        <div class="flex items-center bg-background text-foreground justify-between">
          <label for="password" class="block text-sm font-medium bg-background text-foreground leading-6 ">Password</label>
          <div class="text-sm">
            <p class="font-normal text-violet-600 hover:text-violet-500">Forgot password? Contact Admin</p>
          </div>
        </div>
        <div class="mt-2 ">
          <Input id="password" bind:value={login.password} name="password" type="password" placeholder="Password" autocomplete="current-password" required class="block pl-4 w-full rounded-md  border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6">
          </Input>
          </div>
      </div>

      <div>
        <Button type="submit" on:click={loginFn} class="flex w-full justify-center  px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm  ">Sign in
        </Button>
        </div>
    </form>

    
  </div>
</div>