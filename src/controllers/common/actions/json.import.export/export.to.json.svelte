<script>
    export let value = {};
    import UIButtons from "not-bulma/src/elements/button/ui.buttons.svelte";

    $: json = value && JSON.stringify(value, null, 4);

    const BUTTONS = [
        {
            icon: "clipboard",
            action: () => {
                navigator.clipboard.writeText(json);
            },
        },
    ];
</script>

<pre class="not-top-padding">
    <UIButtons values={BUTTONS} right={true} />
{json}</pre>
