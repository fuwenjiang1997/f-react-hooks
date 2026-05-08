import path from 'node:path'

import { defineConfig } from '@rspress/core'

export default defineConfig({
    // 文档根目录
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
