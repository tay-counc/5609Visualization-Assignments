<script lang="ts">
  import type { TMovie } from "../types";
  import * as d3 from "d3";
  // define the props of the LineChart component
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

  // Get the top three genres
  function getTopGenres(movies: TMovie[], upYear: Date) {
    let genreCounts: { [genre: string]: number } = {};
    movies
      .filter((movie) => movie.year <= upYear)
      .forEach((movie) => {
        movie.genres.forEach((genre: string) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      });
      
    // Sort and get top 3
    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
  }

  const topGenres = $derived(getTopGenres(movies, upYear));

  // Get yearly data for each genre
  function getYearlyData(movies: TMovie[], genres: string[], upYear: Date) {
    // Group by year
    const yearData: { year: Date; [genre: string]: number }[] = [];
    const years = [...new Set(
      movies
        .filter(m => m.year <= upYear)
        .map(m => m.year.getFullYear())
    )].sort();
    
    years.forEach(year => {
      const yearMovies = movies.filter(m => 
        m.year.getFullYear() === year && m.year <= upYear
      );
      
      const dataPoint: any = { year: new Date(year, 0) };
      genres.forEach(genre => {
        dataPoint[genre] = yearMovies.filter(m => 
          m.genres.includes(genre)
        ).length;
      });
      
      yearData.push(dataPoint);
    });
    
    return yearData;
  }

  const genreYearlyData = $derived(getYearlyData(movies, topGenres, upYear));

  // drawing the line chart
  const margin = {
    top: 15,
    bottom: 50,
    left: 30,
    right: 70,
  };

  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
  };

  const xScale = $derived(
    d3.scaleTime()
      .domain(d3.extent(genreYearlyData, d => d.year) as [Date, Date])
      .range([usableArea.left, usableArea.right])
  );

  const yScale = $derived(
    d3.scaleLinear()
      .domain([0, d3.max(genreYearlyData.flatMap(d => 
        topGenres.map(genre => d[genre] || 0)
      )) || 0])
      .range([usableArea.bottom, usableArea.top])
  );

  // Colors for the lines
  const colors = ["#1f77b4", "#ff7f0e", "#2ca02c"];
  
  // Line generator
  function createLine(genre: string) {
    return d3.line<any>()
      .x(d => xScale(d.year))
      .y(d => yScale(d[genre] || 0))
      .curve(d3.curveMonotoneX);
  }

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

  // the $effect function is used to run a function whenever the reactive variables change
  $effect(() => {
    updateAxis();
  });
</script>

<h3>
  Top Three Movie Genres Over Time {yearRange[0]?.getFullYear()} - {yearRange[1]?.getFullYear()}
</h3>

{#if movies.length > 0 && topGenres.length > 0}
  <svg {width} {height}>
    <g class="lines">
      {#each topGenres as genre, i}
        <path
          role="graphics-document"
          aria-label="Line representing {genre} movies over time"
          d={createLine(genre)(genreYearlyData)}
          fill="none"
          stroke={colors[i]}
          stroke-width="2"
          opacity={selectedGenre === genre ? 1 : 0.7}
          onmouseover={() => (selectedGenre = genre)}
          onfocus={() => (selectedGenre = genre)}
          onmouseout={() => (selectedGenre = '')}
          onblur={() => (selectedGenre = '')}
        />
      {/each}
    </g>

    <!-- Legend -->
    {#each topGenres as genre, i}
      <g transform="translate({usableArea.right + 10}, {usableArea.top + 20 + i * 20})">
        <line x1="0" y1="0" x2="15" y2="0" stroke={colors[i]} stroke-width="2" />
        <text 
          x="20" 
          y="4" 
          font-size="10"
          fill={selectedGenre === genre ? colors[i] : "#333"}
        >
          {genre}
        </text>
      </g>
    {/each}

    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
  </svg>
{/if}

<style>
  path {
    transition: opacity 0.2s ease, stroke-width 0.2s ease;
  }
  text {
    transition: fill 0.2s ease;
  }
</style>