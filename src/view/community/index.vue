<template>
    <div class="communityPage p-20">
        <!-- 标题栏 -->
        <div class="d_flex_ac d_flex_sb mb-20">
            <div class="title">社区导航</div>
        </div>
        <!-- 社区导航栏 -->
        <n-tabs type="segment" pane-class="container" animated>
            <n-tab-pane name="EXG" tab="EXG社区">
                <iframe src="https://darkrp.cn/" width="100%" height="100%"></iframe>
            </n-tab-pane>
            <n-tab-pane name="UB" tab="UB社区">
                <iframe src="https://cs.moeub.cn/" width="100%" height="100%"></iframe>
            </n-tab-pane>
            <n-tab-pane name="ZED" tab="ZED社区">
                <iframe src="https://zombieden.cn/" width="100%" height="100%"></iframe>
            </n-tab-pane>
            <n-tab-pane name="FYS" tab="FYS社区">
                <iframe src="https://fyscs.com/" width="100%" height="100%"></iframe>
            </n-tab-pane>
            <n-tab-pane name="93X" tab="93X社区">
                <iframe src="https://servers.upkk.com/" width="100%" height="100%"></iframe>
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui';
</script>

<style scoped lang="scss">
.communityPage {
    height: auto;

    .title {
        font-size: 16px;
        font-weight: bolder
    }

    .container {
        width: 100%;
        height: 90vh;
    }
}
</style>