<script>
  import { createEventDispatcher } from 'svelte';
  import { UIOverlay } from 'not-bulma';

  let has_error = false;
  let error = '';
  let has_info = false;
  let info = '';
  let show = true;
  let closeOnClick = false;
	let closeButton = false;
  export let importing = false;
  let fileField,overlay, filename = '';

  const dispatch = createEventDispatcher();

  function overlayClosed(){
		rejectImport();
	}

  function rejectImport(){
		overlay.$destroy();
		dispatch('reject', {});
	};

  function resolveImport(){
		overlay.$destroy();
		dispatch('resolve', {});
	};

  function fileNameUpdate(){
    if (fileField.files.length > 0){
      let file = fileField.files[0];
      filename = file.name;
    }
  }

  export function setError(message){
    has_error = true;
    error = message;
    importing = false;
  }

  export function setInfo(message){
    has_info = true;
    info = message;
  }

  async function importFile(){
    try{
      if (fileField.files.length > 0){
        let file = fileField.files[0];
        let contentStr = await file.text();
        importing = true;
        dispatch('import', { options: contentStr });
      }
    }catch(e){
      dispatch('reject', {error: e});
    }
  }
</script>


<UIOverlay on:reject="{overlayClosed}" bind:this={overlay} show={true} {closeOnClick} {closeButton}>
  <div class="form-paper box {has_error}">
    <h4 class="title is-4">Импорт настроек из файла</h4>
    <div class="file is-boxed file-select-box">
      <label class="file-label">
        <input class="file-input" type="file" name="optionsToImport" on:change={fileNameUpdate} bind:this="{fileField}" accept=".json" multiple="false">
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload"></i>
          </span>
          <span class="file-label has-text-centered">
            {#if filename }
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
        <button class="button is-primary {importing?'is-loading':''}" on:click={importFile}>Загрузить</button>
      </p>
      <p class="control">
        <button class="button is-light" on:click={rejectImport}>Закрыть</button>
      </p>
    </div>
  </div>
</UIOverlay>


<style>
  .form-paper {
    width: 30vw;
    margin: 35vh auto auto auto;
  }
  .file-select-box{
    margin: 2em 2em;
  }

  .file-select-box .file-label{
    width: 100%;
  }

</style>
