import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  }
})
