import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// En desarrollo (`npm run dev`), Vite hace de reverse proxy: reenvía las
// llamadas /api/* a cada microservicio en su puerto local, quitando el
// prefijo /api. En producción ese mismo trabajo lo hace nginx (ver
// frontend/nginx.conf), así que el frontend usa las mismas rutas /api/...
// en los dos entornos y nunca hardcodea localhost.
const backend = (port) => ({
  target: `http://localhost:${port}`,
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api/, ''),
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/apod':       backend(3001),
      '/api/marte':      backend(3002),
      '/api/asteroides': backend(3003),
      '/api/iss':        backend(3004),
      '/api/auth':       backend(3005),
      '/api/reportes':   backend(3006),
      '/api/alertas':    backend(3007),
    },
  },
})
