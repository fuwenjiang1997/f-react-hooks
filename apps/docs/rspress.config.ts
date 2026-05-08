import path from 'node:path'

import { defineConfig } from '@rspress/core'

export default defineConfig({
    base: '/f-react-hooks/',
    root: 'src',
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
