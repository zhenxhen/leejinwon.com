import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    build: {
      // three / drei 는 거의 안 바뀌는데 용량이 크다. 별도 청크로 떼어두면
      // 본문 코드를 고쳐 배포해도 방문자 브라우저 캐시에 그대로 남는다.
      // manualChunks로 직접 가르지 않는다. React 19는 CJS라 react / react-dom /
      // react-reconciler를 손으로 쪼개면 초기화 순서가 깨진다("Cannot set
      // properties of undefined (setting 'Activity')"). UIOverlay에서 drei
      // 의존을 끊어두면, three/drei/r3f는 lazy로 import하는 Experience 쪽으로
      // Vite가 알아서 몰아준다.
      chunkSizeWarningLimit: 900,
    },
    define: {

    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
