<template>
    <div class="card-wrap">
        <div class="card">{{ title }}</div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const title = ref<string>('vitepress-theme-demovue')
const cardWidth = ref<string>('600px')
</script>

<style scoped>
.card-wrap {
    text-align: center;
}

.card-wrap .card {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 500;
    color: var(--vp-c-brand);
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-brand);
    height: 80px;
    width: v-bind('cardWidth');
}
</style>