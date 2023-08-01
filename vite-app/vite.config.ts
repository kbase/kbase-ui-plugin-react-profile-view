import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './',
    build: {
        commonjsOptions: { include: [] },
    },
    optimizeDeps: {
        disabled: false,
    },
    server: {
        proxy: {
            '/services': {
                target: 'https://ci.kbase.us',
                changeOrigin: true,
                secure: false
            }
        }
    }
})
