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
    //     meta: "网页版本登录器将于2024/9/01 13:00:00 -> 2024/09/01 15:30:00 预计更新完成,问题反馈请加QQ群901243791",
    //     keepAliveOnHover: true,
    // });
    globalStore.initGameSocket()
})
</script>

<style scoped lang="scss"></style>