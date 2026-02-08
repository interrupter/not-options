<script>
    import { Elements } from "not-bulma";
    const UIOverlay = Elements.Modals.UIOverlay;

    let closeOnClick = false;
    let closeButton = false;
    /**
     * @typedef {Object} Props
     * @property {boolean} [importing]
     */

    /** @type {Props} */
    let {
        importing = $bindable(false),
        error = "",
        info = "",
        show = true,
        onreject = () => {},
        onresolve = () => {},
        onimport = () => {},
    } = $props();

    let has_error = $derived(typeof error === "string" && error.length > 0);
    let has_info = $derived(typeof info === "string" && info.length > 0);

    let fileField = $state(),
        overlay = $state(),
        filename = $state("");

    function overlayClosed() {
        rejectImport();
    }

    function rejectImport() {
        overlay.$destroy();
        onreject({});
    }

    function resolveImport() {
        overlay.$destroy();
        onresolve({});
    }

    function fileNameUpdate() {
        if (fileField.files.length > 0) {
            const file = fileField.files[0];
            filename = file.name;
        }
    }

    export function setError(message) {
        has_error = true;
        error = message;
        importing = false;
    }

    export function setInfo(message) {
        has_info = true;
        info = message;
    }

    async function importFile() {
        try {
            if (fileField.files.length > 0) {
                const file = fileField.files[0];
                const contentStr = await file.text();
                importing = true;
                onimport({ options: contentStr });
            }
        } catch (e) {
            onreject({ error: e });
        }
    }
</script>

<UIOverlay
    onreject={overlayClosed}
    bind:this={overlay}
    show={true}
    {closeOnClick}
    {closeButton}
>
    <div class="form-paper box {has_error}">
        <h4 class="title is-4">Импорт настроек из файла</h4>
        <div class="file is-boxed file-select-box">
            <label class="file-label">
                <input
                    class="file-input"
                    type="file"
                    name="optionsToImport"
                    onchange={fileNameUpdate}
                    bind:this={fileField}
                    accept=".json"
                    multiple="false"
                />
                <span class="file-cta">
                    <span class="file-icon">
                        <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label has-text-centered">
                        {#if filename}
                            {filename}
                        {:else}
                            Выберите файл
                        {/if}
                    </span>
                </span>
            </label>
        </div>

        {#if has_error}
            <div class="notification is-danger">{error}</div>
        {/if}

        {#if has_info}
            <div class="notification is-info">{info}</div>
        {/if}

        <div class="field is-grouped is-grouped-centered">
            <p class="control">
                <button
                    class="button is-primary {importing ? 'is-loading' : ''}"
                    onclick={importFile}>Загрузить</button
                >
            </p>
            <p class="control">
                <button class="button is-light" onclick={rejectImport}
                    >Закрыть</button
                >
            </p>
        </div>
    </div>
</UIOverlay>

<style>
    .form-paper {
        width: 30vw;
        margin: 35vh auto auto auto;
    }
    .file-select-box {
        margin: 2em 2em;
    }

    .file-select-box .file-label {
        width: 100%;
    }
</style>
