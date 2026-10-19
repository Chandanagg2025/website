import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Share the repo-root .env with the website so both use the same Firebase project.
  // (On Vercel, set the same VITE_FIREBASE_* vars in the project's Environment Variables.)
  envDir: '..',
  server: {
    port: 5174
  }
})
