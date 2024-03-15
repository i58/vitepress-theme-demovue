<template>
    <demo>
        <component :is="formatPathDemos[path]" v-bind="$attrs" />
        <template #highlight>
            <div v-html="decoded" class="language-vue vp-adaptive-theme" />
        </template>
    </demo>
</template>
<script setup>
import { computed } from 'vue';

defineOptions({
    name: 'VueDemo'
})

const props = defineProps({
    demos: Object,
    source: String,
    path: String
})

const formatPathDemos = computed(() => {
    const demos = {}
    Object.keys(props.demos).forEach((key) => {
        demos[key.replace('/examples/', '')] = props.demos[key].default
    })
    return demos
})
const decoded = computed(() => {
    return `<span class="lang">vue</span>`+ decodeURIComponent(props.source)
})
</script>