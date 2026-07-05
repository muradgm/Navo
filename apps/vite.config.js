import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: [
      '2410-2a00-1f-9886-4401-db93-785b-5599-b1aa.ngrok-free.app',
      '.ngrok-free.app',
    ],
  },
});
