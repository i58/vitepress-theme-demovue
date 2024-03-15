# vitepress-theme-demovue


## 参数

```ts
export interface DemovueMarkdownPluginOptions {
    docRoot: string;
    /** 如果自定义代码块名称中包含特殊字符，一定要使用反斜杠转义。了；例如: {blockName: 'demo\\-vue'} */
    blockName?: string;
}

export interface DemovueVitePluginOptions {
    include: string | string[];
    viteAlias: string;
    customName?: (compName: string) => string;
}
```