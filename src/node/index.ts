import type { Plugin } from 'vite'

import fs from 'node:fs'
import path from 'node:path'
// @ts-ignore
import mdContainer from 'markdown-it-container'

export interface DemovueMarkdownPluginOptions {
    docRoot: string
}

export interface DemovueVitePluginOptions {
    include: string | string[];
    docRoot: string;
    customName?: (compName: string) => string;
}

const isFunc = (val: any): val is (...args: any[]) => any => {
    return Object.prototype.toString.call(val) === '[object Function]'
}
/**
 * vite插件
 */
export function demovueVitePlugin(options: DemovueVitePluginOptions): Plugin {
    return {
        name: 'demovue-md-transform',
        enforce: 'pre',
        async transform(code, id) {
            if (!id.endsWith('.md')) return code
            const includes = Array.isArray(options.include) ? options.include : [options.include]
            const isComponent = new RegExp(includes.map(it => `.*\\/docs\\/${it}\\/[^/]*\\.md$`).join('|')).test(id)
            if(!isComponent) return code
            const basename = path.basename(id, '.md')
            const componentId = isFunc(options.customName) ? options.customName(basename) : basename
            const codeStr = combineScriptSetup([
                // ~/ 是在/docs/vite.config.ts 中配置的路径别名
                `const VUEDEMO_DEMOS = import.meta.glob('${options}/examples/${componentId}/*.vue', { eager: true })`,
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
export const demovueMarkdownPlugin = (md: any, options: DemovueMarkdownPluginOptions) => {
    md.use(mdContainer, 'lcdp', {
        validate(params: string) {
            return params.trim().match(/^lcdp\s*(.*)$/)
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
                    source = fs.readFileSync(path.resolve(options.docRoot, 'examples', sourceFile), 'utf-8')
                }
                if (!source) throw new Error(`源文件路径不正确: ${sourceFile}`)

                return `<vue-demo :demos="VUEDEMO_DEMOS" source="${encodeURIComponent(
                    md.options.highlight?.(source, 'vue', '') as any
                )}" path="${sourceFile}">`
            } else {
                return '</vue-demo>'
            }
        }
    })
}