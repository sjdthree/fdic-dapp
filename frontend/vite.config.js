import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Set the limit to 5 MiB
      },
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'On-Chain FDIC Insurance DApp',
        short_name: 'FDIC DApp',
        description: 'On-chain FDIC-like insurance application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/assets/claim.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/deposit.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      crypto: "empty-module",
      assert: "empty-module",
      http: "empty-module",
      https: "empty-module",
      os: "empty-module",
      url: "empty-module",
      zlib: "empty-module",
      stream: "empty-module",
      _stream_duplex: "empty-module",
      _stream_passthrough: "empty-module",
      _stream_readable: "empty-module",
      _stream_writable: "empty-module",
      _stream_transform: "empty-module",
      "@fortawesome/fontawesome-svg-core": "@fortawesome/fontawesome-svg-core",
    },
  },
  define: {
    global: "globalThis",
  },
});