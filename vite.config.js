import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server:{
		headers:{
			"X-Frame-Option": "SAMEORIGIN",
			"SameSite": "Strict"
		},
		proxy:{
			'/api':{
				target:"http://localhost:8000",
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, ''),
			}
		},
	}
});
