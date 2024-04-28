<template>
    <div class="card-wrap">
        <div class="card">{{ title }}</div>
    </div>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
    setup() {
        return {
            title: ref('vitepress-theme-demovue')
        }
    }
})
</script>
<style  scoped>
.card-wrap {
    text-align: center;
}

.card-wrap .card {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 500;
    color: pink;
    background: var(--vp-c-bg);
    border: 1px solid pink;
    height: 80px;
    width: 600px;
}
</style>