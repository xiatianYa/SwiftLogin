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
import { NLayout } from "naive-ui";
</script>

<style scoped lang="scss"></style>