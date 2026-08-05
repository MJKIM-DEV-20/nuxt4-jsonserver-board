import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // 3000은 다른 프로젝트(rootpay)가 쓰고 있어 3100.
  // strictPort: 조용히 다른 포트로 밀리는 대신 충돌 시 바로 실패.
  server: { port: 3100, strictPort: true },
})
