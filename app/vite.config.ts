import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command, isSsrBuild }) => ({
  base: '/',
  // Dev only — it stamps every element with its source file and line number,
  // which has no business being in a shipped page.
  plugins: [...(command === 'serve' ? [inspectAttr()] : []), react()],
  build: {
    rollupOptions: {
      // Client only. In the SSR pass these packages are external, and naming
      // an external module in manualChunks is a hard rollup error.
      output: isSsrBuild
        ? {}
        : {
            // Split the long-lived vendor code out of the app chunk so a
            // content change doesn't invalidate the framework bundle in
            // visitors' caches.
            manualChunks: {
              react: ['react', 'react-dom', 'react-router-dom'],
              motion: ['motion/react'],
            },
          },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
