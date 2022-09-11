<script>
    import { Slider, TextField, Button } from "smelte";
    import { onDestroy } from "svelte";
    import { userId } from "../store";
    import { postDiary } from "../helpers/api";

    let uid = null;
    const unsubscribe = userId.subscribe((id) => (uid = id));
    onDestroy(() => {
        unsubscribe;
    });

    let rate = 5;
    let body = "";
    let image = "";
    let preview = "";

    const submit = async () => {
        if (body.length < 10) {
            alert("日記の内容は10文字以上書いてください");
            return false;
        }

        // firestoreへPOST
        const result = await postDiary(uid, body, rate, image);
        if (!result) {
            alert("日記の追加が失敗しました。");
        } else {
            alert("日記が保存されました！");
            document.location.href = "/";
        }
    };

    const onFileSelect = (e) => {
        let target = e.target.files[0];
        image = target;
        if (!target) {
            preview = "";
            return;
        }
        image = target;
        let reader = new FileReader();
        reader.readAsDataURL(target);
        reader.onload = (e) => {
            preview = e.target.result;
        };
    };
</script>

<h3>日記を書こう</h3>
<form on:submit|preventDefault={submit} class="p-5">
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
    {#if preview}
        <img src={preview} class="mb-6" alt="preview" />
    {/if}
    <label
        for="file-input"
        class="bg-primary-900 dark:bg-secondary-300 px-4 py-3 w-4/12 m-auto mb-6 block rounded"
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
    <Button
        type="submit"
        class="bg-primary-900 dark:bg-secondary-700 dark-hover:bg-dark-700 py-3 text-black-900"
        >保存</Button
    >
</form>
