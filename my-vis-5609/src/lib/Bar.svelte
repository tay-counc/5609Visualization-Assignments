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

  const genreNums = $derived(getGenreNums(movies, upYear));

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
    // tip: use d3.scaleBand() to create a band scale for the x-axis
    // d3
    //   .scaleBand()
    //   .range(xx)
    //   .domain(xx)
    //   .padding(xx),

    d3.scaleBand()
      .domain(Object.keys(genreNums))  // Use genre names as domain
      .range([usableArea.left, usableArea.right])  // Scale to fit SVG width
      .padding(0.1) // Adds spacing between bars
  );

  const yScale = $derived(
    // tip: use d3.scaleLinear() to create a linear scale for the y-axis
    // d3
    //   .scaleLinear()
    //   .range(xx)
    //   .domain(xxx),

    d3.scaleLinear()
      .domain([0, d3.max(Object.values(genreNums)) ?? 1])  // Avoid NaN errors
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

    // tip:
    // similar to the x-axis, create a y-axis using d3.axisLeft() and bind it to the yAxis variable
  }

  // the $effect function is used to run a function whenever the reactive variables change, also known as a side effect
  $effect(() => {
    updateAxis();
  });
</script>

<h3>
  The Distribution of Genres {yearRange[0]?.getFullYear()} - {yearRange[1]?.getFullYear()}
</h3>

{#if movies.length > 0}
  <svg {width} {height}>
    <g class="bars">
      {#each Object.entries(genreNums) as [genre, cnt]}
        <g class={genre}>
          <!-- tip: draw bars here using the svg <rect/> component -->
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
            {selectedGenre === `${genre}: ${cnt}` ? selectedGenre : cnt}
          </text>
        </g>
      {/each}
    </g>

    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
  </svg>
{/if}

<style>
  .bar {
    transition:
      y 0.1s ease,
      height 0.1s ease,
      width 0.1s ease; /* Smooth transition for height */
  }
</style>