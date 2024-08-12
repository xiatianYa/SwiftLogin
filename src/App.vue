<template>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="globalStore.nightCycle ? null : darkTheme">
        <n-notification-provider placement="bottom-right">
            <n-message-provider>
                <RouterView />
            </n-message-provider>
        </n-notification-provider>
    </n-config-provider>
</template>

<script setup lang="ts">
import useStore from "@/store"
import { onMounted } from 'vue';
import { NConfigProvider, NNotificationProvider, NMessageProvider, zhCN, dateZhCN, darkTheme } from 'naive-ui'
import { RouterView } from 'vue-router'
let { globalStore } = useStore()

onMounted(() => {
    globalStore.initSocket()
})
</script>

<style scoped lang="scss"></style>
