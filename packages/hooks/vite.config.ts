import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'index',
            fileName: 'index',
            formats: ['es', 'umd']
        },
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true
    }
})
