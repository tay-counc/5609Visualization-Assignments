<script lang="ts">
  import * as d3 from "d3";
  import type { TMovie } from "../types";

  export let movies: TMovie[];

  let genreNums: { [genre: string]: number } = {};
  $: yearRange = d3.extent(movies.map((d) => d.year))!;

  $: {
    function CountGenres(movies: TMovie[]) {
      let res: { [genre: string]: number } = {};

      movies.forEach((movie) => {
        movie.genres.forEach((genre: string) => {
          if (res[genre]) {
            res[genre]++;
          } else {
            res[genre] = 1;
          }
        });
      });
      return res;
    }

    genreNums = CountGenres(movies);
  }

  // chart variables

  const margin = {
      top: 10,
      bottom: 50,
      left: 30,
      right: 10,
    },
    width = 400,
    height = 300;

  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
  };

  // add axis
  let xAxis: any, yAxis: any;
  let xScale =
    ""; /*tip:please use the suitable d3 scaler for the x axis of your bar chart */

  let yScale =
    ""; /*tip:please use the suitable d3 scaler for the y axis of your bar chart */

  let xBarwidth: number;

  $: {
    // $: run whenever the depencies change

    xScale.domain(/*tip: Update domain for xScale*/);
    yScale.domain(/*tip: Update domain for yScale*/);

    xBarwidth = xScale.bandwidth();

    // add axis and labels
    d3.select(xAxis)
      .call(d3.axisBottom(xScale))
      .selectAll("text") // Select all text labels on the axis
      .attr("transform", "rotate(45)") // Rotate the text
      .style("text-anchor", "start");

    d3.select(yAxis).call(d3.axisLeft(yScale));
  }
</script>

<h3>
  The Distribution of Genres {yearRange[0]?.getFullYear()}- {yearRange[1]?.getFullYear()}
</h3>
{#if movies.length > 0}
  <svg {width} {height}>
    <g class="bars">
      {#each Object.entries(genreNums) as [genre, cnt]}
        <g class={genre}>
          <!-- tip: binding the svg elements below to your genre data
          <rect
            width=
            height=
            x=
            y=
            fill="#449900"
          />
          <text
            x=
            y=
            font-size="10"
            text-anchor="middle">
            {cnt}
          </text> 
          -->
        </g>
      {/each}
    </g>

    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
  </svg>
{/if}
