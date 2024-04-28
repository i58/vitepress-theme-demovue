# Card

常用的卡片布局。

## 基础用法

基础的卡片用法。

::: vue

guide/index.vue

:::



## Setup TypeScript

setup typescript 用法。


::: vue

guide/demo2.vue

:::


## 兼容`vitepress-theme-demoblock`的用法

:::demo

```jsx
import { defineComponent, ref } from 'vue'
import '@/styles/index.css'

export default defineComponent({
  setup() {
    const title = ref('vitepress-theme-demoblock')
    
    return () => (
      <div class="card-wrap card-wrap--card">
        <div class="card">{ title.value }</div>
      </div>
    )
  }
})
```

:::