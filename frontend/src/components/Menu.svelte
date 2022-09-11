<script>
    import { Router, Link } from "svelte-routing";
    import { scale } from "svelte/transition";
    import { quadOut } from "svelte/easing";
    import { signInWithGoogle, signOutWithGoogle } from "../helpers/firebase";
    import { userId } from "../store";
    import { onDestroy } from "svelte";
    let uid;

    const unsubscribe = userId.subscribe((id) => {
        uid = id;
    });
    onDestroy(() => unsubscribe);

    export let open;
</script>

{#if open}
    <nav
        class="bg-primary-900 dark:bg-dark-900"
        on:click={() => (open = false)}
    >
        <Router>
            <Link class="block mb-3" to="/">Home</Link>
            <Link class="block mb-3" to="about">日記の効果とは</Link>

            {#if !uid}
                <Link class="block mb-3" to="#" on:click={signInWithGoogle}
                    >ログイン</Link
                >
            {:else}
                <Link class="block mb-3" to="create">Create</Link>
                <Link class="block mb-3" to="#" on:click={signOutWithGoogle}
                    >ログアウト</Link
                >
            {/if}
        </Router>
        <hr transition:scale={{ duration: 750, easing: quadOut, opacity: 1 }} />
    </nav>
{/if}

<style>
    nav {
        text-align: center;
        font-size: 1.5em;
        letter-spacing: 0.15em;
        padding: 1em;
        padding-top: 0;
        color: #eef;
    }
</style>
