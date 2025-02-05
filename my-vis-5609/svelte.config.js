import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      pages: 'build',   // Ensures the output directory is correct
      assets: 'build',
      fallback: '404.html'
    }),
    paths: {
      base: process.env.GITHUB_ACTIONS ? '/5609Visualization-Assignments' : ''
    },
    prerender: {
      handleHttpError: 'warn'
    }
  }
};
