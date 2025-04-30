import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { FaIcons } from 'react-icons/fa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), react-FaIcons()],

  
})
