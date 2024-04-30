import type { Plugin } from 'vite'

import fs from 'node:fs'
import path from 'node:path'
// @ts-ignore
import mdContainer from 'markdown-it-container'

const DEMO_COMPONENTS_KEY = 'DEMO_COMPONENTS'

export interface DemovueMarkdownPluginOptions {
    /**
     * vitepress文档的根路径，默认是 docs
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
     * vitepress文档的根路径，默认是 docs
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

const isFunc = (val: any): val is (...args: any[]) => any => {
    return Object.prototype.toString.call(val) === '[object Function]'
}
/**
 * vite插件
 */
export function demovueVitePlugin(options: DemovueVitePluginOptions = {} as any): Plugin {
    return {
        name: 'demovue-md-transform',
        enforce: 'pre',
        async transform(code, id) {
            if (!id.endsWith('.md')) return code
            const includes = Array.isArray(options.include) ? options.include : [options.include]
            const isComponent = new RegExp(includes.map(dir => `.*\\/${options.rootName || 'docs'}\\/${dir}\\/[^/]*\\.md$`).join('|')).test(id)
            if(!isComponent) return code
            const basename = path.basename(id, '.md')
            const componentId = isFunc(options.loadDir) ? options.loadDir(id) : basename
            const codeStr = combineScriptSetup([
                // viteAlias https://vitejs.dev/guide/features.html#glob-import-caveats
                `const ${DEMO_COMPONENTS_KEY} = import.meta.glob('${options.viteAlias}/examples/${componentId}/*.vue', { eager: true })`,
            ])
            return combineMarkdown(code, [codeStr], [])
        },
    }
}

const combineScriptSetup = (codes: string[]) =>
    `\n<script setup>
${codes.join('\n')}
</script>
`
const combineMarkdown = (
    code: string,
    headers: string[],
    footers: string[]
) => {
    const frontmatterEnds = code.indexOf('---\n\n')
    const firstHeader = code.search(/\n#{1,6}\s.+/)
    const sliceIndex =
        firstHeader < 0
            ? frontmatterEnds < 0
                ? 0
                : frontmatterEnds + 4
            : firstHeader

    if (headers.length > 0)
        code =
            code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex)
    code += footers.join('\n')

    return `${code}\n`
}
/**
 * markdown-it 扩展
 */
export const demovueMarkdownPlugin = (md: any, options: DemovueMarkdownPluginOptions = {} as any) => {
    const BLOCK_NAME = options.blockName || 'vue'
    const ROOT = (options.root || path.resolve(__dirname, 'docs'))
    const REG_EXP = new RegExp(`^${BLOCK_NAME}\\s*(.*)$`)
    md.use(mdContainer, BLOCK_NAME, {
        validate(params: string) {
            return params.trim().match(REG_EXP)
        },
        render(tokens: any[], idx: number) {
            /* means the tag is opening */
            if (tokens[idx].nesting === 1) {
                const sourceFileToken = tokens[idx + 2]
                let source = ''
                const sourceFile = sourceFileToken.children?.[0].content ?? ''
                // console.log('*************', sourceFile)
                if (sourceFileToken.type === 'inline') {
                    // 获取代码code，用于展示
                    source = fs.readFileSync(path.resolve(ROOT, 'examples', sourceFile), 'utf-8')
                }
                if (!source) throw new Error(`源文件路径不正确: ${sourceFile}`)

                return `<demo-vue :demos="${DEMO_COMPONENTS_KEY}" source="${encodeURIComponent(
                    md.options.highlight?.(source, 'vue', '') as any
                )}" path="${sourceFile}">`
            } else {
                return '</demo-vue>'
            }
        }
    })
}