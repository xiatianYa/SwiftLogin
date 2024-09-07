<template>
    <n-layout style="height: 100vh;">
        <Header class="layoutHeader"></Header>
        <RouterView />
        <setUp></setUp>
    </n-layout>
</template>

<script setup lang="ts">
import Header from "./header.vue"
import setUp from './setup.vue'
import useStore from "@/store"
import { NLayout, createDiscreteApi } from "naive-ui";
import { onMounted } from "vue";
let { globalStore, userStore } = useStore()

//通知对象
const { notification } = createDiscreteApi(["notification"]);
onMounted(() => {
    //通知
    // notification["warning"]({
    //     content: "更新通知",
    //     meta: "网页版本登录器将于2024/9/07 14:00 -> 未知,将新增首页模块,问题反馈可加反馈群901243791,欢迎大家提供意见。",
    //     keepAliveOnHover: true,
    // });
    globalStore.initGameSocket()
})
</script>

<style scoped lang="scss"></style>