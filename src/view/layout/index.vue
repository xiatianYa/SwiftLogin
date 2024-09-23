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
    notification["info"]({
        content: "更新通知",
        meta: "登录器软件版已发布,请申请QQ群:901243791进行下载。",
        keepAliveOnHover: true,
    });
    globalStore.initGameSocket()
})
</script>

<style scoped lang="scss"></style>