In this assignment, we will explore summer movies ( movies with "summer" in their title ) using visualization. [This dataset](https://github.com/Visual-Intelligence-UMN/5609Visualization-Assignments/blob/main/A1-Visual-Encoding/summer_movies.csv) is coming from [IMDb Non-Commercial Datasets](https://developer.imdb.com/non-commercial-datasets/).
Please download the dataset and put it in the `static` folder of your project.

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


We will continue use the code code we developed in Assignment 0. 
Please move the `src/routes/+page.svelte` you created in A1 into `src/routes/A0/+page.svelte`. You can still access it via `http://localhost:5173/A0`. 
Similarly, we will create `src/routes/A1/+page.svelte` for this assignment.
We will need to install d3 for this assignment.
```
npm i -S d3
npm i --save-dev @types/d3
```

Below, step 1 and step 2 will provide instructions to load the csv data and create a bar chart displaying genre distribution.
Through this process, you’ll also learn how to load data and bind them to graphical elements in Svelte.


## 1. Load Data
A template code has been provided in this folder. Copy and paste its content into your `src/routes/A1/+page.svelte` file.
Follow the tips included in the template code to properly format the CSV file.

## 2. Draw Genre Distribution
Follow these step-by-step instructions to create a bar chart displaying genre distribution.
Through this process, you’ll also learn how to bind data to graphical elements in Svelte.

## 3. Sketch Visual Designs
For each of the following questions, sketch at least three different visual design concepts. 
Aim to explore diverse visual encodings for each. 
Afterward, compare your sketches and explain why one design is better than the others in effectively addressing the question.

- Q1: How do the genres with the top 3 number of movies change over time?
- Q2: Are there any correlations between different genres? For example, which genre often co-occurs with comedy?

## 4. Implement Your Visualizations

Finally, implement the chosen design for each question and report the insights gained from your visualizations.