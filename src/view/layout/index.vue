<template>
    <n-layout style="height: 100vh;">
        <Header class="layoutHeader"></Header>
        <RouterView />
    </n-layout>
</template>

<script setup lang="ts">
import Header from "./header.vue"
import { NLayout } from "naive-ui";
</script>

<style scoped lang="scss"></style>