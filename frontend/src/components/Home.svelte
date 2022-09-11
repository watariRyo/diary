<script>
    import { Button, ProgressCircular, TextField } from "smelte";
    import { onMount, onDestroy } from "svelte";
    import { Router, Link } from "svelte-routing";
    import { userId } from "../store";
    import { fetch } from "../helpers/api";
    import StarRating from "svelte-star-rating";
    import dayjs from "dayjs";
    import { signInWithGoogle } from "../helpers/firebase";

    let uid;
    let filterMonth;
    const unsubscribe = userId.subscribe((id) => (uid = id));

    let promise = fetch();
    onMount(async () => {
        promise = await fetch(uid);
    });

    onDestroy(() => {
        unsubscribe;
    });
    const filterHandle = async () => {
        promise = await fetch(uid, filterMonth);
    };
</script>

{#if !uid}
    <Button class="mt-10" on:click={signInWithGoogle}>ログイン</Button>
{:else}
    <section class="m-auto w-6/12 mb-10">
        <h5>日記を検索</h5>
        <TextField
            type="month"
            bind:value={filterMonth}
            on:change={filterHandle}
        />
    </section>
    {#await promise}
        <p class="mt-10 flex justify-center"><ProgressCircular /></p>
    {:then diaries}
        {#if diaries.length > 0}
            <Router>
                {#each diaries as d}
                    <Link
                        to={"/diary/" + d.id}
                        class="flex items-center mb-6 border-b-2"
                    >
                        <aside class="diary-aside">
                            <p class="text-left">
                                {dayjs(d.createdAt).format("YYYY-MM-DD")}
                            </p>
                            <img
                                class="diary-image"
                                src={d.image ? d.image : "/dummy.jpeg"}
                                alt="diary"
                            />
                            <p class="mb-6">
                                <StarRating rating={d.rate / 2} />
                            </p>
                        </aside>
                        <p>{d.body}</p>
                    </Link>
                {/each}
            </Router>
        {:else}
            <p>日記が見つかりませんでした...</p>
        {/if}
    {/await}
{/if}

<style>
    .diary-aside {
        width: 40%;
        margin-right: 1rem;
    }
    .diary-image {
        width: 100%;
    }
</style>
