import react from '@vitejs/plugin-react';
import { defineConfig, type UserConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import eslint from 'vite-plugin-eslint2';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

const libraryOptions: UserConfig = {
  publicDir: false,
  build: {
    lib: {
      name: 'react-files-input',
      entry: resolve(__dirname, 'lib/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime']
    }
  }
};

const staticPageOptions: UserConfig = {
  base: '/react-files-input/',
  build: {
    outDir: 'build'
  }
};

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    UnoCSS({
      mode: mode === 'build:ci' ? 'global' : 'dist-chunk'
    }),
    eslint(),
    mode !== 'build:ci' &&
      dts({
        include: ['lib'],
        rollupTypes: true,
        tsconfigPath: './tsconfig.app.json'
      })
  ],
  ...(mode === 'build:ci' ? staticPageOptions : libraryOptions)
}));
