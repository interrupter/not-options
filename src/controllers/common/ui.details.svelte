<script>
  export let item = {};
</script>

<h2 class="h2">Опция {item.id}</h2>
<div class="container">

  <div class="columns">
    <div class="column">ID</div>
    <div class="column">{item.id}</div>
  </div>

  <div class="columns">
    <div class="column">Активна</div>
    <div class="column">
      {#if item.active }
      <span class="tag is-success">Да</span>
      {:else }
      <span class="tag is-danger">Нет</span>
      {/if}
    </div>
  </div>

  <div class="columns">
    <div class="column">Значение</div>
    <div class="column">{item.value}</div>
  </div>


</div>
