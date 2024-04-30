# vitepress-theme-demovue

## 简介

`vitepress-theme-demovue` 是基于[vitepress-theme-demoblock](https://github.com/xinlei3166/vitepress-theme-demoblock)的一个插件，主要添加直接渲染vue组件的功能

## 安装

```bash
pnpm add -D vitepress-theme-demovue

```

## 快速上手

`.vitepress/config.js` 文件中使用 `demovueMarkdownPlugin` 和 `demovueVitePlugin` 插件

```ts
import { defineConfig } from 'vitepress'
import { demoblockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'
import { demovueMarkdownPlugin, demovueVitePlugin } from 'vitepress-theme-demovue'


export default defineConfig({
    ...,
    markdown: {
        config: (md) => {
            md.use(demoblockPlugin)
            md.use(demovueMarkdownPlugin)
        }
    },
    vite: {
        plugins: [
            demoblockVitePlugin(),
            demovueVitePlugin({
                viteAlias: '~/',
                include: ['component', 'smart\\-table'],
                customName(id: string) {
                    const isSmartTable = /.*\/docs\/smart\-table\/[^/]*\.md$/.test(id)
                    return isSmartTable ? 'smart-table' : path.basename(id, '.md')
                },
            }) as any,
        ]
    }
})

```

`.vitepress/theme/index.js` 中注册 `vitepress-theme-demovue`组件

```ts
import DefaultTheme from 'vitepress/theme'
import DemoVue from 'vitepress-theme-demovue/dist/DemoVue.vue'
import Demo from 'vitepress-theme-demoblock/dist/client/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/dist/client/components/DemoBlock.vue'

import 'vitepress-theme-demoblock/dist/theme/styles/index.css'

export default {
    ...DefaultTheme,
    enhanceApp(ctx) {
        DefaultTheme.enhanceApp(ctx)

        ctx.app.component('DemoVue', DemoVue)
        ctx.app.component('Demo', Demo)
        ctx.app.component('DemoBlock', DemoBlock)
    }
}
```


## 参数

```ts

export interface DemovueMarkdownPluginOptions {
    /**
     * vitepress文档的根路径，默认是 path.resolve(__dirname, 'docs')
     */
    root: string;
    /**
     * 代码块名称  默认vue
     * ```
     * ::: vue
     * button/index.vue
     * ::: 
     * ```
     */
    blockName?: string;
}

export interface DemovueVitePluginOptions {
    /**
     * vitepress文档的根路径名称，默认是 docs
     */
    rootName: string;
    /**
     * 当前项目下vite配置的路径别名
     */
    viteAlias: string;
    /**
     * 包含哪些路径，只有路径下的文件才会处理 `blockName`
     */
    include: string | string[];
    /**
     * 哪些文件需要加载 vue文件
     */
    loadDir?: (path: string) => string;
}
```

## 配置示例

```ts
export default defineConfig({

    markdown: {
        config: (md) => {
            md.use(demoblockPlugin)
            md.use(demovueMarkdownPlugin, {
                root: path.resolve(__dirname, '../')
            })
        }
    },

    vite: {
        plugins: [
            vueJsx(),
            demovueVitePlugin({
                rootName: 'playground',
                viteAlias: '@',
                include: ['guide'],
                loadDir(id) {
                    const basename = path.basename(id, ".md");
                    //===  /other.md$/.test(id) ? 'other' :'guide'
                    return basename === 'other' ? 'other' :'guide'
                },
            }),
            demoblockVitePlugin()
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '../')
            }
        }
    },
})
```