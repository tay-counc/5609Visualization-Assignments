<script lang="ts">
  import * as d3 from "d3";
  import { Bar } from "$lib";
  import { onMount } from "svelte";

  type TMovie = {
    num_votes: number;
    runtime_minutes: number;
    genres: string[];
    year: Date;
    average_rating: number;
    tconst: string;
    title_type: string;
    primary_title: string;
    original_title: string;
  };

  // Reactive variable for storing the data
  let movies: TMovie[] = [];

  // Function to load the CSV
  async function loadCsv() {
    try {
      const csvUrl = "./summer_movies.csv";
      movies = await d3.csv(csvUrl, (row) => {
        // in row, all values are strings, so we need to use row conversion function to format them
        return {
          ...row, //
          num_votes: Number(row.num_votes),
          year: new Date(row.year),
          // TIP: please also format the values for the following attributes
          // runtime_minutes: ,
          // genres: ,
          // average_rating: ,
        };
      });

      console.log("Loaded CSV Data:", movies);
    } catch (error) {
      console.error("Error loading CSV:", error);
    }
  }
  // Call the loader when the component mounts
  onMount(loadCsv);
</script>

<h1>Summer Movies</h1>

<p>Here are {movies.length == 0 ? "..." : movies.length + " "} movies</p>
<!-- <Bar {movies} /> -->
