import { defineConfig } from 'vitepress'
import { demoblockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'
import { demovueMarkdownPlugin, demovueVitePlugin } from 'vitepress-theme-demovue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

export default defineConfig({
    title: 'Vitepress',
    description: '一个基于 Vitepress 的主题插件，它可以帮助你在编写文档的时候增加 Vue 示例。',

    lastUpdated: true,
    cleanUrls: true,

    markdown: {
        theme: { light: 'github-light', dark: 'github-dark' },
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
                root: 'playground',
                viteAlias: '@',
                include: ['guide'],
                loadDir(id) {
                    const basename = path.basename(id, ".md");
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

    themeConfig: {
        outlineTitle: '本页目录',
        lastUpdatedText: '上次更新',
        logo: '/logo.svg',
        search: {
            provider: 'local'
        },

        nav: [
            { text: '文档', link: '/guide/' }
        ],

        // sidebar
        sidebar: {
            '/guide/': [
                {
                    text: '文档',
                    collapsible: false,
                    items: [
                        { text: '指南', link: '/guide/' },
                        { text: '基础示例', link: '/guide/basic' },
                        { text: '第三方库', link: '/guide/other' },
                        { text: '包含 markdown 文件', link: '/guide/include' }
                    ]
                }
            ]
        },

        editLink: {
            pattern: 'https://github.com/xinlei3166/vitepress-theme-demoblock/edit/main/docs/:path',
            text: '在 GitHub 上编辑此页'
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/xinlei3166/vitepress-theme-demoblock' }
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2024 gezg'
        }
    }
})
