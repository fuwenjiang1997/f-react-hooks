import path from 'node:path'

import { defineConfig } from '@rspress/core'

export default defineConfig({
    base: '/f-react-hooks/',
    root: 'src/doc',
    globalStyles: path.join(__dirname, 'tailwind.css'),
    title: 'f-react-hooks 文档',
    builderConfig: {
        resolve: {
            alias: {
                '@f-react-hooks/hooks': path.resolve(
                    __dirname,
                    '../../packages/hooks/dist/index.js' // 指向 hooks 包的入口文件
                )
            }
        }
    }
})
