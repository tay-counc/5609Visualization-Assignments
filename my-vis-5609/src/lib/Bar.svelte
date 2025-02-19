<script lang="ts">
  import type { TMovie } from "../types";
  import * as d3 from "d3";
  // define the props of the Scatter component
  type Props = {
    movies: TMovie[];
    width?: number;
    height?: number;
  };
  // width and height have default values
  let { movies, width = 500, height = 400 }: Props = $props();

  let selectedPoint: string = $state();
  let xGenre: string = $state("Drama");  // Default x-axis genre
  let yGenre: string = $state("Comedy"); // Default y-axis genre

  // processing the data; $derived is used to create a reactive variable that updates whenever the dependent variables change
  function getAllGenres(movies: TMovie[]) {
    const genres = new Set<string>();
    movies.forEach(movie => {
      movie.genres.forEach(genre => {
        genres.add(genre);
      });
    });
    return Array.from(genres).sort();
  }

  const allGenres = $derived(getAllGenres(movies));

  // Prepare data by year for the scatter plot
  function getYearlyGenreCounts(movies: TMovie[]) {
    const yearlyData: { year: number; [genre: string]: number }[] = [];
    
    // Group by year
    const yearGroups = d3.group(movies, m => m.year.getFullYear());
    
    // Count genres for each year
    yearGroups.forEach((yearMovies, year) => {
      const dataPoint: any = { year };
      
      // Initialize all genres to 0
      allGenres.forEach(genre => {
        dataPoint[genre] = 0;
      });
      
      // Count movies for each genre in this year
      yearMovies.forEach(movie => {
        movie.genres.forEach(genre => {
          dataPoint[genre] += 1;
        });
      });
      
      yearlyData.push(dataPoint);
    });
    
    return yearlyData;
  }

  const scatterData = $derived(getYearlyGenreCounts(movies));

  // drawing the scatter plot
  const margin = {
    top: 20,
    bottom: 50,
    left: 50,
    right: 20,
  };

  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
  };

  // Scales
  const xScale = $derived(
    d3.scaleLinear()
      .domain([0, d3.max(scatterData, d => d[xGenre] || 0) || 0])
      .range([usableArea.left, usableArea.right])
      .nice()
  );

  const yScale = $derived(
    d3.scaleLinear()
      .domain([0, d3.max(scatterData, d => d[yGenre] || 0) || 0])
      .range([usableArea.bottom, usableArea.top])
      .nice()
  );

  let xAxis: any = $state(),
    yAxis: any = $state();

  function updateAxis() {
    d3.select(xAxis)
      .call(d3.axisBottom(xScale));

    d3.select(yAxis)
      .call(d3.axisLeft(yScale));
  }

  // the $effect function is used to run a function whenever the reactive variables change, also known as a side effect
  $effect(() => {
    updateAxis();
  });
  
  // Calculate correlation
  function calculateCorrelation() {
    if (scatterData.length < 2) return 0;
    
    const xValues = scatterData.map(d => d[xGenre] || 0);
    const yValues = scatterData.map(d => d[yGenre] || 0);
    
    const n = xValues.length;
    const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
    const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;
    
    let numerator = 0;
    let xDenominator = 0;
    let yDenominator = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = xValues[i] - xMean;
      const yDiff = yValues[i] - yMean;
      numerator += xDiff * yDiff;
      xDenominator += xDiff * xDiff;
      yDenominator += yDiff * yDiff;
    }
    
    const denominator = Math.sqrt(xDenominator * yDenominator);
    return denominator === 0 ? 0 : numerator / denominator;
  }
  
  const correlation = $derived(calculateCorrelation());
</script>

<h3>
  Genre Correlation: {xGenre} vs {yGenre}
</h3>

<div class="controls">
  <div class="select-group">
    <label for="xGenre">X-Axis Genre:</label>
    <select id="xGenre" bind:value={xGenre}>
      {#each allGenres as genre}
        <option value={genre}>{genre}</option>
      {/each}
    </select>
  </div>
  
  <div class="select-group">
    <label for="yGenre">Y-Axis Genre:</label>
    <select id="yGenre" bind:value={yGenre}>
      {#each allGenres as genre}
        <option value={genre}>{genre}</option>
      {/each}
    </select>
  </div>
</div>

<div class="correlation-info">
  Correlation coefficient: {correlation.toFixed(2)}
  <span class="correlation-strength">
    ({Math.abs(correlation) < 0.3 ? 'Weak' : Math.abs(correlation) < 0.7 ? 'Moderate' : 'Strong'} 
    {correlation < 0 ? 'negative' : 'positive'} correlation)
  </span>
</div>

{#if movies.length > 0}
  <svg {width} {height}>
    <line
      x1={xScale(0)}
      y1={yScale(0)}
      x2={xScale(d3.max(scatterData, d => d[xGenre] || 0) || 0)}
      y2={yScale(d3.max(scatterData, d => d[xGenre] || 0) || 0)}
      stroke="#ddd"
      stroke-width="1"
      stroke-dasharray="4"
    />
    
    <g class="points">
      {#each scatterData as point}
        <circle
          role="button"
          tabindex="0"
          aria-label="Data point for year ${point.year}"
          cx={xScale(point[xGenre] || 0)}
          cy={yScale(point[yGenre] || 0)}
          r="5"
          fill="#4682B4"
          opacity="0.7"
          stroke={selectedPoint === `${point.year}` ? "#333" : "none"}
          stroke-width="2"
          onmouseover={() => (selectedPoint = `${point.year}`)}
          onfocus={() => (selectedPoint = `${point.year}`)}
          onmouseout={() => (selectedPoint = '')}
          onblur={() => (selectedPoint = '')}
        />
        
        {#if selectedPoint === `${point.year}`}
          <text
            x={xScale(point[xGenre] || 0) + 10}
            y={yScale(point[yGenre] || 0) - 5}
            font-size="12"
          >
            {point.year}: ({point[xGenre] || 0}, {point[yGenre] || 0})
          </text>
        {/if}
      {/each}
    </g>
    
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
    
    <text
      x={width / 2}
      y={height - 5}
      text-anchor="middle"
      font-size="12"
    >
      {xGenre} Movies Count
    </text>
    
    <text
      transform="rotate(-90)"
      x={-height / 2}
      y="15"
      text-anchor="middle"
      font-size="12"
    >
      {yGenre} Movies Count
    </text>
  </svg>
{/if}

<style>
  .controls {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
  }
  
  .select-group {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .correlation-info {
    margin-bottom: 10px;
    font-size: 14px;
  }
  
  .correlation-strength {
    font-style: italic;
  }
  
  circle {
    transition: r 0.2s, opacity 0.2s;
    cursor: pointer;
  }
  
  circle:hover {
    r: 7;
    opacity: 1;
  }
</style>