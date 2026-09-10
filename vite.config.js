// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/weather-app/",
  server: {
    port: 3000, // you can change the port if needed
  },
});
