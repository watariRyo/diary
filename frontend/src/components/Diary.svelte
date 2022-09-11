<script>
    import dayjs from "dayjs";
    import { Button, ProgressCircular, Slider, TextField } from "smelte";

    import { onMount } from "svelte";
    import { getDiary, updateDiary, deleteDiary } from "../helpers/api";

    export let id;
    let promise = getDiary();
    let rate, body, image, preview;

    onMount(async () => {
        promise = await getDiary(id);
        rate = promise.rate;
        body = promise.body;
    });

    const submit = async () => {
        const returnValue = await updateDiary(id, body, rate, image);
        if (returnValue) {
            alert("日記の更新が完了しました");
        } else {
            alert("更新ができませんでした。やり直してください");
            document.location.href("/");
        }
    };

    const onFileSelect = (e) => {
        let target = e.target.files[0];
        image = target;
        let reader = new FileReader();
        reader.readAsDataURL(target);
        reader.onload = (e) => {
            preview = e.target.result;
        };
    };

    const deleteHandler = async () => {
        const result = await deleteDiary(id);
        if (result) {
            alert("日記の削除が完了しました。");
            location.href = "/";
        } else {
            alert(
                "日記の削除に失敗しました。通信環境の良いところで再度実行してください"
            );
            location.href = "/";
        }
    };
</script>

{#await promise}
    <p class="mt-10 flex justify-center"><ProgressCircular /></p>
{:then diary}
    <h4>{dayjs(diary.createdAt).format("YYYY-MM-DD")}の日記</h4>
    <form on:submit|preventDefault={submit} class="p-5 mb-5">
        {#if preview}
            <img src={preview} class="mb-6" alt="preview" />
        {:else}
            <img
                class="mb-6"
                src={diary.image ? diary.image : "/dummy.jpeg"}
                alt="diary"
            />
        {/if}
        <label
            for="file-input"
            class="bg-primary-900 dark:bg-secondary-700 px-4 py-3 w-4/12 m-auto mb-6 block rounded"
            >画像を選択</label
        >
        <input
            id="file-input"
            class="hidden"
            type="file"
            accept="image/*"
            bind:this={image}
            on:change={(e) => onFileSelect(e)}
        />
        <p class="mb-4">今日の気分は{rate}点です</p>
        <Slider class="mb-4" min="1" max="10" bind:value={rate} />
        <h6 class="mb-3 mt-6">Outlined textarea</h6>
        <TextField
            label="日記の本文"
            bind:value={body}
            textarea
            rows="5"
            outlined
            class="bg-white-900"
        />
        <Button
            type="submit"
            class="text-black-900 dark:bg-secondary-500 dark-hover:bg-dark-500"
            >日記を更新</Button
        >
    </form>
    <Button
        class="bg-alert-900 dark:bg-alert-600 dark-hover:bg-dark-700 mb-5"
        on:click={deleteHandler}>日記を削除</Button
    >
{/await}
