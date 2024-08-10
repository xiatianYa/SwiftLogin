<template>
    <!-- csgo2 -->
    <div class="csgo2Page">
        <!-- 数据统计 -->
        <div class="d_flex d_flex_sb mb-20">
            <div class="title">服务器列表</div>
            <div class="title">407 / 1738在线</div>
        </div>
        <!-- 搜索 -->
        <div class="d_flex d_flex_sb mb-20">
            <n-select class="mr-10" v-model:value="community" :options="communityOptions" placeholder="请选择社区" />
            <n-select class="mr-10" v-model:value="community" :options="modeOptions" placeholder="请选择模式" />
            <n-button class="mr-10" strong secondary type="primary" :render-icon="renderIcon(AlarmOutline)">
                自动挤服 / 挂机模式
            </n-button>
            <n-button class="mr-10" strong secondary type="primary" :render-icon="renderIcon(MapOutline)">
                地图订阅
            </n-button>
            <n-button strong secondary type="info" :render-icon="renderIcon(Search)">
                搜索
            </n-button>
        </div>
        <!-- 表格 -->
        <div>
            <reuseTable :tableColumns="serverColumns" :tableData="serverData" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { ref, h } from 'vue';
import { NSelect, NButton, NIcon } from 'naive-ui';
import { Search, AlarmOutline, MapOutline, CopyOutline, EnterOutline } from '@vicons/ionicons5';
import reuseTable from '@/components/reuseTable/index.vue'
//选中的社区
const community = ref<number>()
//社区配置项
const communityOptions = ref([
    {
        label: '僵尸乐园',
        value: 1
    },
    {
        label: 'EXG社区',
        value: 2
    },
    {
        label: '风云社',
        value: 3
    },
    {
        label: 'UB社区',
        value: 3
    },
])
//模式配置项
const modeOptions = ref([
    {
        label: '僵尸逃跑',
        value: 1
    },
    {
        label: '僵尸感染',
        value: 2
    },
    {
        label: '躲猫猫',
        value: 3
    },
])
//服务器表格字段
const serverColumns = ref([
    {
        title: '模式',
        key: 'mode'
    },
    {
        title: '服务器名称',
        key: 'serverName'
    },
    {
        title: '地图名',
        key: 'mapName'
    },
    {
        title: '人数',
        key: 'peopleNumber'
    },
    {
        title: '操作',
        key: 'actions',
        render(row: any) {
            return h(
                'div', // 或者任何你想要的容器元素，这里用 div 作为示例  
                [
                    h(
                        NButton,
                        {
                            strong: true,
                            tertiary: true,
                            size: 'small',
                            type: 'info',
                            style: { marginRight: '10px' },
                            renderIcon: renderIcon(EnterOutline),
                            onClick: () => play(row) // 假设 play 函数现在可以接收一个额外的参数来区分操作  
                        },
                        { default: () => '加入' }
                    ),
                    h(
                        NButton,
                        {
                            strong: true,
                            tertiary: true,
                            size: 'small',
                            type: 'info',
                            style: { marginRight: '10px' },
                            renderIcon: renderIcon(CopyOutline),
                            onClick: () => play(row) // 另一个操作  
                        },
                        { default: () => '复制连接指令' }
                    )
                ]
            );
        },
    }
])
//服务器表格数据
const serverData = ref([
    { mode: "僵尸逃跑", serverName: 'EXG社区 生化追击', mapName: 'obj_npst', peopleNumber: "64/64" },
    { mode: "僵尸感染", serverName: 'EXG社区 生化感染', mapName: '未知', peopleNumber: "64/64" },
    { mode: "躲猫猫", serverName: 'EXG社区 躲猫猫', mapName: '未知', peopleNumber: "64/64" }
])
const play = (row: any) => {
    console.log(row);
}
//注册图标
const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
}
</script>

<style scoped lang="scss">
.csgo2Page {
    .title {
        font-size: 16px;
        font-weight: bolder
    }
}
</style>