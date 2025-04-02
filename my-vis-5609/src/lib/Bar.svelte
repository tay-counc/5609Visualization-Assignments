<script lang="ts">
  import type { TMovie } from "../types";
  import * as d3 from "d3";
  // define the props of the Bar component
  type Props = {
    movies: TMovie[];
    progress?: number;
    width?: number;
    height?: number;
  };
  // progress is 100 by default unless specified
  let { movies, progress = 100, width = 500, height = 400 }: Props = $props();

  let selectedGenre: string = $state();

  // processing the data; $derived is used to create a reactive variable that updates whenever the dependent variables change
  const yearRange = $derived(d3.extent(movies.map((d) => d.year)));

  function getUpYear(yearRange: [undefined, undefined] | [Date, Date]) {
    if (!yearRange[0]) return new Date();
    const timeScale = d3.scaleTime().domain(yearRange).range([0, 100]);
    return timeScale.invert(progress);
  }
  const upYear: Date = $derived(getUpYear(yearRange!));

  // Get a comparison year (5 years before the current year or the earliest available)
  function getComparisonYear(upYear: Date): Date {
    if (!yearRange[0]) return upYear;
    const comparisonYear = new Date(upYear);
    comparisonYear.setFullYear(upYear.getFullYear() - 5);
    
    // Make sure we don't go before the earliest year
    if (comparisonYear < yearRange[0]) {
      return new Date(yearRange[0]);
    }
    return comparisonYear;
  }
  
  const comparisonYear = $derived(getComparisonYear(upYear));

  function getGenreNums(movies: TMovie[], upYear: Date) {
    let res: { [genre: string]: number } = {};
    movies
      .filter((movie) => movie.year <= upYear)
      .forEach((movie) => {
        movie.genres.forEach((genre: string) => {
          res[genre] = (res[genre] || 0) + 1;
        });
      });
    return res;
  }

  function getComparisonGenreNums(movies: TMovie[], comparisonYear: Date) {
    let res: { [genre: string]: number } = {};
    movies
      .filter((movie) => movie.year <= comparisonYear)
      .forEach((movie) => {
        movie.genres.forEach((genre: string) => {
          res[genre] = (res[genre] || 0) + 1;
        });
      });
    return res;
  }

  const genreNums = $derived(getGenreNums(movies, upYear));
  const comparisonGenreNums = $derived(getComparisonGenreNums(movies, comparisonYear));

  // drawing the bar chart

  const margin = {
    top: 15,
    bottom: 50,
    left: 30,
    right: 10,
  };

  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
  };

  const xScale = $derived(
    d3.scaleBand()
      .domain(Object.keys(genreNums))  // Use genre names as domain
      .range([usableArea.left, usableArea.right])  // Scale to fit SVG width
      .padding(0.1) // Adds spacing between bars
  );

  const yScale = $derived(
    d3.scaleLinear()
      .domain([0, Math.max(
        d3.max(Object.values(genreNums)) || 0,
        d3.max(Object.values(comparisonGenreNums)) || 0
      ) * 1.1])  // Max value from either year + 10% for padding
      .range([usableArea.bottom, usableArea.top])  // SVG y-coordinates (bottom to top)
  );

  const xBarwidth: number = $derived(xScale.bandwidth());

  let xAxis: any = $state(),
    yAxis: any = $state();

  function updateAxis() {
    d3.select(xAxis)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start");

    d3.select(yAxis)
      .call(d3.axisLeft(yScale));
  }

  // the $effect function is used to run a function whenever the reactive variables change, also known as a side effect
  $effect(() => {
    updateAxis();
  });
</script>

<h3>
  The Distribution of Genres {upYear.getFullYear()} with {comparisonYear.getFullYear()} comparison
</h3>

{#if movies.length > 0}
  <svg {width} {height}>
    <!-- Bars for the current year -->
    <g class="current-bars">
      {#each Object.entries(genreNums) as [genre, cnt]}
        <rect
          role="graphics-document"
          aria-label="Bar representing {genre} with {cnt} movies"
          width={xBarwidth}
          height={yScale(0) - (yScale(cnt) ?? 0)}
          x={xScale(genre) ?? 0}
          y={yScale(cnt) ?? 0}
          fill="#449900"
          class="bar"
          opacity={selectedGenre === `${genre}: ${cnt}` ? 1 : 0.7}
          onmouseover={() => (selectedGenre = `${genre}: ${cnt}`)}
          onfocus={() => (selectedGenre = `${genre}: ${cnt}`)}
          onmouseout={() => (selectedGenre = '')}
          onblur={() => (selectedGenre = '')}
        />
        <text
          x={xScale(genre)! + xBarwidth / 2}
          y={yScale(cnt) - 5}
          font-size="12"
          text-anchor="middle"
        >
          {cnt}
        </text>
      {/each}
    </g>

    <!-- Comparison lines to show changes from comparison year -->
    <g class="comparison-lines">
      {#each Object.entries(genreNums) as [genre, cnt]}
        {#if comparisonGenreNums[genre]}
          <line
            x1={(xScale(genre) ?? 0) + xBarwidth/2}
            y1={yScale(comparisonGenreNums[genre]) ?? 0}
            x2={(xScale(genre) ?? 0) + xBarwidth/2}
            y2={yScale(cnt) ?? 0}
            stroke={cnt > comparisonGenreNums[genre] ? "#22AA22" : "#AA2222"}
            stroke-width="2"
            stroke-dasharray="4,2"
            stroke-opacity="0.7"
          />
          <circle
            cx={(xScale(genre) ?? 0) + xBarwidth/2}
            cy={yScale(comparisonGenreNums[genre]) ?? 0}
            r="4"
            fill="#3366cc"
            stroke="#111111"
            stroke-width="1"
          />
        {/if}
      {/each}
    </g>

    <!-- Legend -->
    <g class="legend">
      <rect x="50" y="20" width="15" height="15" fill="#449900" />
      <text x="70" y="32" font-size="12">{upYear.getFullYear()} (Current)</text>
      
      <circle cx="200" cy="27" r="4" fill="#3366cc" />
      <text x="210" y="32" font-size="12">{comparisonYear.getFullYear()} (Comparison)</text>
      
      <line x1="320" y1="27" x2="345" y2="27" stroke="#22AA22" stroke-width="2" stroke-dasharray="4,2" />
      <text x="350" y="32" font-size="12">Increase</text>
      
      <line x1="400" y1="27" x2="425" y2="27" stroke="#AA2222" stroke-width="2" stroke-dasharray="4,2" />
      <text x="430" y="32" font-size="12">Decrease</text>
    </g>

    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
  </svg>
{/if}

<style>
  .bar {
    transition:
      y 0.5s ease,
      height 0.5s ease,
      width 0.5s ease;
  }
  
  line, circle {
    transition: 
      y1 0.5s ease, 
      y2 0.5s ease,
      cy 0.5s ease;
  }
</style>