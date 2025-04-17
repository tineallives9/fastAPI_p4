// // frontend/vite.config.js

// import { defineConfig } from "vite";

// export default defineConfig({
//   server: {
//     proxy: {
//       "/todos": "http://localhost:8000", // Proxy FastAPI backend
//     },
//   },
// });

// vite.config.js
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [ preact() ],
  server: {
    proxy: { '/todos': 'http://localhost:8000' }
  }
});

