import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: [
        {
            input: 'src/node/index',
            name: 'node/index'
        },
        {
            input: 'src/components/',
            name: 'dist/'
        },
    ],
    clean: true,
    declaration: true,
    externals: ['vite'],
    rollup: {
        // emitCJS: true
    }
})