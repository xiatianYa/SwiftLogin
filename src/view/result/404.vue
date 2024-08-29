<template>
    <div class="result d_flex_ac">
        <n-result style="width: 100%;" status="404" title="404 资源不存在" description="生活总归带点荒谬">
            <template #footer>
                <n-button @click="goHome">返回首页</n-button>
            </template>
        </n-result>
    </div>
</template>

<script setup lang="ts">
import { NResult, NButton } from 'naive-ui';
import { useRouter } from "vue-router";
//路由
const Router = useRouter()

const goHome = () => {
    Router.push({ path: '/' })
}
</script>

<style scoped lang="scss">
.result {
    width: 100%;
    height: 100vh;
    background-color: rgba($color: #000000, $alpha: 0.9);
}
</style>