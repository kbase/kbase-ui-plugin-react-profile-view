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
                configure: (proxy, options) => {
                    proxy.on('error', (error, request, response) => {
                        console.log('PROXY ERROR', error);
                    }),
                        proxy.on('proxyReq', (proxyRequest, request, response) => {
                            console.log('PROXY Request', request.method, request.url);
                        }),
                        proxy.on('proxyRes', (proxyResponse, request, response) => {
                            console.log('PROXY Response', proxyResponse.statusCode, request.url);
                        })
                }
            }
        }
    }
})
