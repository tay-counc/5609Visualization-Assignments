## 0. Preparation
- Ensure you have a code IDE like [VSCode](https://code.visualstudio.com/download) installed. While you are welcome to use any IDE of your choice, this course will assume the use of VSCode for demonstrations.
- [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) on your machine.
- Ensure that you have a github account [how to register](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github)
- Make sure you have [Git installed on your computer](https://git-scm.com/downloads)
- Have a Chrome Web Browser

## 1. Preliminary Knowledge: HTML+JS+CSS

   - This class assumes you have basic knowledge of web development. However, here's a quick refresher to jog your memory.
   <img width="500" alt="image" src="https://github.com/user-attachments/assets/c39cfa55-87fe-441f-bcf1-d65ff90c9f74">

   In your VSCode, create an `index.html` file as the one shown above.

   Open it in your chrome browser and you will see a webpage like below. Please the button will change the shwoing number of clicks.

   <img width="150" alt="image" src="https://github.com/user-attachments/assets/ddbc6d63-04c8-4a68-8845-882e99698c98">

   **Modify the webpage to refresh your memory**
   1. [modify the style] change the background color of the button to `#44aa66`, modify the button font size to  `font-size: xx-large`
   2. [modift the webpage content] as shown below
   3. [modify the function] Display the remaining number of clicks. After 5 clicks, show an alert: "No more clicks remaining!".

      <img width="150" alt="image" src="https://github.com/user-attachments/assets/cdac5565-8026-4e8c-98c2-ab4a16850773">


## 2. Svelte

- a. **Start A Svelte Project using Svelte Kit**

   * Svelte is a modern front-end framework for building web applications. 
Unlike traditional frameworks like React or Vue, which use a virtual DOM, Svelte shifts much of the work to the build step. 
It compiles your components into highly efficient, plain JavaScript code that updates the DOM directly. 
This results in faster performance and smaller bundle sizes.

   * SvelteKit provides an easy way to start a Svelte Project.
In your terminal, find a location you like to save the project, and run `npx sv create my-vis-5609` 
(You can name it whatever you prefer, but we will assume `my-vis-5609` as the folder name for following demonstration)

      <img width="500" alt="image" src="https://github.com/user-attachments/assets/6403d66a-8eef-4c5a-b7da-0fc97bcc2c35">

- Open the `my-vis-5609` folder in VSCode.
- Open the terminal by selecting `View > Terminal` from the menu bar, or by pressing the `⌃`` keyboard shortcut.
- Run `npm run dev -- --open` in the terminal. The website will be open in `http://localhost:5173/`. Whenever you change the code, the website will be updated automatically.

b. **Move the Above Modifed Button Test into Your Svelte Project**
   - Svelte has a very similar sytax to HTML. One main difference is that the reactivey model in Svelte enables intuitive and efficient modification of DOM (i.e., webpage content) based on the variables defined on the script.
   - Please change the `src/routes/+page.svelte` in your project to [the provided template](https://github.com/Visual-Intelligence-UMN/5609Visualization-Assignments/blob/main/A1/%2Bpage.svelte). Modify the file to achive the same "Remaining Number of Clicks" function described above. We have provided three tips in the template code.

References: [Offical Svelte Tutorials](https://svelte.dev/tutorial/svelte/welcome-to-svelte)


## 3. Publish to Github Page

a. **Create A Github Repository** 
Sign into VSCode with your GitHub account in the Accounts menu, located in the lower right of the Activity bar.

<img width="150" alt="image" src="https://github.com/user-attachments/assets/7963cb4c-6457-4cbf-8ee8-049caffa2d8e"/>

You can then use the source control feature in VSCode to initialize your repo, publish the repo to github, and commit + push changes.

<img width="150" alt="image" src="https://github.com/user-attachments/assets/77b28a2a-3cb9-42db-97fc-a3c8e6a8e9c7">
<img width="150" alt="image" src="https://github.com/user-attachments/assets/21d96b06-250e-44af-906e-75e676a17bb7">

b. **Deploy Your Website to Github Page**
   
- On github.com, enable GitHub Pages on your repo by selecting “Github Actions” as the source (Repo settings → Pages → Source: GitHub Actions).
<img width="450" alt="image" src="https://github.com/user-attachments/assets/27485da5-55fc-4153-8c09-ab06c3bc473c"/>

- In your terminal, run `npm i -D --save @sveltejs/adapter-static`.

- Visit the [SvelteKit Guide to deploy to GitHub Pages](https://svelte.dev/docs/kit/adapter-static#GitHub-Pages), and copy the code shown for the following files:

  - `.github/workflows/deploy.yml` (you will need to create a `.github` folder — note the dot — and a `workflows` folder inside it. Change the `/${{ github.event.repository.name }}` to `my-vis-5609`)
  - `svelte.config.js` (this will replace svelte.config.js file already in your project. Change `process.env.BASE_PATH` to  `my-vis-5609`).


Commit and push these changes to your repo.

If all goes well, your app should be deployed to `YOUR_USERNAME.github.io/my-vis-5609`.  
To see our GitHub Action in action (no pun intended 🙃), navigate to the “Actions” tab on your GitHub repo. You’ll be able to see both actions that are currently running, as well as past ones.

## 4. Submission
Please submit the URL of your github page in Canvas.









