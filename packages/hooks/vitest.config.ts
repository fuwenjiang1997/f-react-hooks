import { defineConfig } from 'vitest/config'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'hooksCore',
            fileName: 'hooksCore',
            formats: ['es', 'umd']
        },
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false
    },
    test: {
        reporters: ['default', 'verbose'],
        environment: 'jsdom',
        include: ['src/**/__tests__/*.spec.ts'],
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'lcov']
        }
    }
})
