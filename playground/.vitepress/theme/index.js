import DefaultTheme from 'vitepress/theme'

import DemoVue from 'vitepress-theme-demovue/dist/DemoVue.vue'
import Demo from 'vitepress-theme-demoblock/dist/client/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/dist/client/components/DemoBlock.vue'

import 'element-plus/dist/index.css'
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'

import './style.css'
// import message from 'vitepress-theme-demoblock/dist/client/components/message'
// import ElementPlus from 'element-plus'
// import cn from 'element-plus/lib/locale/lang/zh-cn'

export default {
    ...DefaultTheme,
    enhanceApp(ctx) {
        DefaultTheme.enhanceApp(ctx)

        ctx.app.component('DemoVue', DemoVue)
        ctx.app.component('Demo', Demo)
        ctx.app.component('DemoBlock', DemoBlock)
    }
}
