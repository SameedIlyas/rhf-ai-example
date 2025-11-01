import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode (e.g., .env, .env.development)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5173,
    },
    define: {
      // Make env variables available as process.env.*
      'process.env': env,
    },
  };
});

