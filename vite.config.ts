import {
  defineConfig,
} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import postcssPresentEnv from 'postcss-preset-env';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  publicPath: '/',
  plugins: [
    vue(),
  ],
  resolve: {
    dedupe: [
      'vue',
    ],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssPresentEnv({
          stage: 3,
          minimumVendorImplementations: 2,
        }),
      ],
    },
  },
}));
