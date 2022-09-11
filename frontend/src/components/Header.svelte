<script>
    import { Hamburger } from "svelte-hamburgers";
    import BrightnessContrast from "carbon-icons-svelte/lib/BrightnessContrast.svelte";
    import Menu from "./Menu.svelte";
    import { onMount } from "svelte";
    let open;
    const toggleDark = () => {
        // bodyタグにmode-darkクラスを追加
        if (localStorage.isDark === "true") {
            // lightモード切り替え
            document.getElementById("body").classList.remove("mode-dark");
            localStorage.isDark = "false";
        } else {
            // darkモード切り替え
            document.getElementById("body").classList.add("mode-dark");
            localStorage.isDark = "true";
        }
    };

    onMount(() => {
        if (localStorage.isDark === "true") {
            // darkモード切り替え
            document.getElementById("body").classList.add("mode-dark");
            localStorage.isDark = "true";
        } else {
            // lightモード切り替え
            document.getElementById("body").classList.remove("mode-dark");
            localStorage.isDark = "false";
        }
    });
</script>

<header
    class="bg-primary-900 dark:bg-dark-900 flex justify-between items-center"
>
    <Hamburger bind:open --color="white" />
    <img src="/logo.png" alt="logo" on:click={() => (location.href = "/")} />
    <label for="brightness-contrast" on:click={toggleDark}>
        <BrightnessContrast
            id="brightness-contrast"
            class="mr-6 text-white-600"
        />
    </label>
</header>
<Menu bind:open />

<style>
    header {
        height: 60px;
    }

    img {
        max-height: 100%;
    }
</style>
