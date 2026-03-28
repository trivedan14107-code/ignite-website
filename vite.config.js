import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        hostelDetail: resolve(__dirname, 'hostel-detail.html'),
        listings: resolve(__dirname, 'listings.html'),
        ownerAuth: resolve(__dirname, 'owner-auth.html'),
        ownerDashboard: resolve(__dirname, 'owner-dashboard.html'),
        terms: resolve(__dirname, 'terms.html'),
      },
    },
  },
});
