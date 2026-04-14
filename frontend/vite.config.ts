import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host: true, // binds to 0.0.0.0 — required inside Docker
    port: 5173,
    allowedHosts: ["tamber.kiseki-miracle.dev"],
  },
});
