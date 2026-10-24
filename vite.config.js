import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	// Keep CRA-style env var names so existing Vercel env settings keep working
	envPrefix: "REACT_APP_",
	build: {
		// Keep CRA's output directory so the Vercel output setting stays valid
		outDir: "build",
	},
});
