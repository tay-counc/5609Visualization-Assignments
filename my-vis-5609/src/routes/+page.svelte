<script>
    let maxClick = 4; 
    let cnt = maxClick;
    
    function onClick() {
        if (cnt > 0) {
            cnt -= 1;
        }
    }
</script>

<h1>Taylor's VIS Site</h1>
<!-- I added an alt image since the script "npm run dev -- --open" was giving an error when opening  -->
<img
    width="200px"
    src="/5609Visualization-Assignments/Annie.png"
	alt="Annie" 
/>

<div>
    You can click up to
    <select 
        bind:value={maxClick}
        on:change={() => (cnt = maxClick)}>
        {#each [2, 4, 6] as optionNum}
            <option value={optionNum}>
                {optionNum}
            </option>
        {/each}
    </select>
    times
</div>

<button on:click={onClick}>Click Me</button>

{#if cnt > 0}
    <p id="info">Remaining Number of Clicks: {cnt}</p>
{:else}
    <p>No more clicks allowed</p>
{/if}

<style>
    body {
        font-family: Arial, Helvetica, sans-serif;
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