In this assignment, we will explore summer movies ( movies with "summer" in their title ) using visualization. [This dataset]() is coming from [IMDb Non-Commercial Datasets](https://developer.imdb.com/non-commercial-datasets/)

Variables in `summer_movies.csv`

|variable        |class     |description     |
|:---------------|:---------|:---------------|
|tconst          |character |alphanumeric unique identifier of the title |
|title_type      |character |the type/format of the title (movie, video, or tvMovie) |
|primary_title   |character |the more popular title / the title used by the filmmakers on promotional materials at the point of release |
|original_title  |character |original title, in the original language |
|year            |integer   |the release year of a title |
|runtime_minutes |integer   |primary runtime of the title, in minutes |
|genres          |character |includes up to three genres associated with the title (comma-delimited)  |
|simple_title    |character |the title in lowercase, with punctuation removed, for easier filtering and grouping |
|average_rating  |double    |weighted average of all the individual user ratings on IMDb |
|num_votes       |integer   |number of votes the title has received on IMDb (titles with fewer than 10 votes were not included in this dataset) |


We will continue use the code code we developed in Assignment 1. 
Please move the `src/routes/+page.svelte` you created in A1 into `src/routes/A1/+page.svelte`. You can still access it via `http://localhost:5173/A1`. 
Similarly, we will create `src/routes/A2/+page.svelte` for this assignment.
Run ```npm i -S d3```

1. a-how the rating of summer movies change over time; b- will the movie genres influence the movie length?
   For each question, sketch three difference visualization design, and compare them
   Then implement 


## 1. Load Data

## 2. 

## 3. Implement Visualizations