import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.env.BASE_PATH || ''  // Uses environment variable for flexibility
		},
		prerender: {
			handleHttpError: 'warn'  // Prevent build failure on missing assets
		}
	}
};

export default config;
