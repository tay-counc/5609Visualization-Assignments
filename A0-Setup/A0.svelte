<script>
    let maxClick = 'should be a state';
    let cnt = 'should be a state'; // tip: https://svelte.dev/docs/svelte/$state
    
  
    function onClick() {
      // tip: Since DOM (i.e., the webpage content) will automatically update based on values, [<p id="info">Remaining Number of Clicks: {cnt}</p>]
      // we only need to change the cnt number here. 
    }
  </script>
  
  <h1>[Your Name]'s VIS Site</h1>
  <img
    width="200px"
    src="url to your favorite image"
  />
  <div>
    You can click up to
    <select 
        bind:value={/*tip: bind the select action to change the maxClick value. https://svelte.dev/docs/svelte/bind#select-bind:value */} 
        onchange={() => (/*tip: define what will happen after click. Maybe you want to update the remaining number of clikc when click a new maxClick value */)}>
      {#each [2, 4, 6] as optionNum}
        <option value={optionNum}>
          {optionNum}
        </option>
      {/each}
    </select>
    times
  </div>
  <button onclick={onClick}> Click Me </button>

  <!-- tip: No need to write code here, just want to point it out that the content below will automatically update when cnt value changes -->
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
      /* background-color: blue; */
      color: white;
      font-size: xx-large;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
      border-radius: 5px;
    }
  </style>
  