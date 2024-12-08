
<script>
    let maxClick = 5
    let cnt = 'should be a state'; // tip1: https://svelte.dev/docs/svelte/$state
    function onClick() {
        // tip 2: change the cnt number here, which will directly change the DOM below
    };
</script>

<style>
    body {
        font-family: Arial, Helvetica, sans-serif
    }
    button {
        background-color: #44aa66;
        color: white;
        font-size: xx-large;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
    border-radius: 5px;
    }
</style>

<h1>[Your Name]'s VIS Site</h1>
<img width="200px" src="url to a preferred image" />
<p>You can click up to {maxClick} times</p>
<button onclick={onClick}>
    Click Me
</button>
<!-- tip3: an if module here can help showing differen content based on cnt. https://svelte.dev/tutorial/svelte/else-if-blocks -->
<p id="info">Remaining Number of Clicks: {cnt} </p>
