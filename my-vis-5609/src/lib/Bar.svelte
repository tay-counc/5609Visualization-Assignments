<script lang="ts">
  import type { TMovie } from "../types";
  import * as d3 from "d3";
  import { onMount } from "svelte";

  // Define props with default values
  export let movies: TMovie[] = [];
  export let progress: number = 100;
  export let width: number = 500;
  export let height: number = 400;

  let selectedGenre: string | null = null;

  // Compute the range of years in the dataset
  let yearRange: [Date, Date] = d3.extent(movies, (d) => d.year) as [Date, Date];

  function getUpYear(yearRange: [Date, Date]) {
    if (!yearRange[0]) return new Date();
    const timeScale = d3.scaleTime().domain(yearRange).range([0, 100]);
    return timeScale.invert(progress);
  }
  let upYear: Date = getUpYear(yearRange);

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
  let genreNums = getGenreNums(movies, upYear);

  // SVG margins
  const margin = { top: 15, bottom: 50, left: 50, right: 10 };
  let usableWidth = width - margin.left - margin.right;
  let usableHeight = height - margin.top - margin.bottom;

  // Scales
  let xScale = d3.scaleBand()
    .domain(Object.keys(genreNums))
    .range([0, usableWidth])
    .padding(0.2);

  let yScale = d3.scaleLinear()
    .domain([0, d3.max(Object.values(genreNums)) || 1])
    .range([usableHeight, 0]);

  let xAxis: any, yAxis: any;

  function updateAxis() {
    d3.select(xAxis)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start");

    d3.select(yAxis).call(d3.axisLeft(yScale));
  }

  onMount(() => {
    updateAxis();
  });

</script>

<h3>
  The Distribution of Genres {yearRange[0]?.getFullYear()} - {yearRange[1]?.getFullYear()}
</h3>

{#if movies.length > 0}
  <svg {width} {height}>
    <g transform="translate({margin.left}, {margin.top})">
      {#each Object.entries(genreNums) as [genre, count]}
        <g class={genre}>
          <rect
            width={xScale.bandwidth()}
            height={usableHeight - yScale(count)}
            x={xScale(genre)}
            y={yScale(count)}
            fill="#449900"
            class="bar"
            opacity={selectedGenre === genre ? 0.5 : 1}
            on:mouseover={() => selectedGenre = genre}
            on:mouseout={() => selectedGenre = null}
          />
          <text
            x={xScale(genre)! + xScale.bandwidth() / 2}
            y={yScale(count) - 5}
            font-size="12"
            text-anchor="middle"
          >
            {count}
          </text>
        </g>
      {/each}
    </g>

    <g transform="translate({margin.left}, {height - margin.bottom})" bind:this={xAxis} />
    <g transform="translate({margin.left}, {margin.top})" bind:this={yAxis} />
  </svg>
{/if}

<style>
  .bar {
    transition:
      y 0.1s ease,
      height 0.1s ease,
      width 0.1s ease;
  }
</style>
