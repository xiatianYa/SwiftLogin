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
let { globalStore } = useStore()

//通知对象
const { notification } = createDiscreteApi(["notification"]);
onMounted(() => {
    //通知
    // notification["warning"]({
    //     content: "更新通知",
    //     meta: "网页版本登录器将于2024/08/25 15:30进行功能更新,大概在2024/08/25 17:00更新完成,问题反馈请加QQ群",
    //     keepAliveOnHover: true,
    // });
    globalStore.initSocket()
})
</script>

<style scoped lang="scss"></style>