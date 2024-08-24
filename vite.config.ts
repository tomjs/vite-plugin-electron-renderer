import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { builtinModules } from 'node:module'
import { defineConfig } from 'vite'
import pkg from './package.json'

const isdev = process.argv.slice(2).includes('--watch')

export default defineConfig({
  build: {
    minify: false,
    emptyOutDir: !isdev,
    target: 'node14',
    lib: {
      entry: {
        index: 'src/index.ts',
        'cjs-shim': 'src/cjs-shim.ts',
      },
      formats: ['cjs', 'es'],
      fileName: format => format === 'es' ? '[name].mjs' : '[name].js',
    },
    rollupOptions: {
      external: [
        'esbuild',
        'vite',
        ...builtinModules,
        ...builtinModules.map(m => `node:${m}`),
        ...Object.keys('dependencies' in pkg ? pkg.dependencies as object : {}),
      ],
      output: {
        exports: 'named',
      },
    },
  },
})
