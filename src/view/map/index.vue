<template>
    <div class="mapPage p-20">
        <!-- 标题栏 -->
        <div class="d_flex_ac d_flex_sb mb-20">
            <div class="title">地图列表</div>
        </div>
        <!-- 地图搜索栏 -->
        <div class="d_flex d_flex_sb mb-20">
            <div style="width: 90%;">
                <div class="d_flex flex-wrap">
                    <n-select class="mr-5 mt-10" v-model:value="queryParam.modeId" :options="selectOption.mode"
                        placeholder="请选择模式" clearable />
                    <n-select class="mr-5 mt-10" v-model:value="queryParam.type" :options="selectOption.type"
                        placeholder="请选择难度" clearable />
                </div>
                <div class="d_flex flex-wrap">
                    <n-select class="mr-5 mt-10" v-model:value="queryParam.tag" :options="selectOption.tag"
                        placeholder="请选择标签" clearable />
                    <n-input class="mr-5 mt-10" v-model:value="queryParam.label" placeholder="请输入地图名称译名" clearable />
                </div>
                <div style="width: 100%;">
                    <n-button class="mt-10 mr-10" type="warning" :render-icon="renderIcon(TrashOutline)"
                        @click="onClear">重置</n-button>
                    <n-button class="mt-10" type="info" :render-icon="renderIcon(Search)" @click="onSearch">
                        查询
                    </n-button>
                </div>
            </div>
        </div>
        <!-- 表格 -->
        <div>
            <n-spin :show="loading" :size="'large'" style="min-height: 50vh;">
                <reuseTable :tableColumns="mapColumns" :tableData="mapData" v-show="!loading" />
                <reuse-Pagination :page="queryParam.pageNum" :count="queryParam.count" :pageSize="queryParam.pageSize"
                    :pageSizes="queryParam.pageSizes" @size-change="onSizeChange"
                    @current-change="onCurrentChange"></reuse-Pagination>
                <template #description>
                    加载中,请耐心等待...
                </template>
            </n-spin>
        </div>
    </div>
</template>

<script setup lang="ts">
import reuseTable from '@/components/reuseTable/index.vue'
import reusePagination from '@/components/reusePagination/index.vue'
import { ref, h, Component, onMounted } from 'vue';
import { listModeEnum, listTagEnum, listTypeEnum } from '@/api/enum'
import { listMap } from '@/api/map'
import { NSelect, NButton, NIcon, NInput, NTag, NImage, useNotification, NSpin } from 'naive-ui';
import { Search, TrashOutline, CopyOutline } from '@vicons/ionicons5';
import { CustomType } from '@/types';
//消息弹出框
const notification = useNotification()
//数据加载
const loading = ref(false)
//地图数据
const mapData = ref()
//地图配置项
const mapColumns = ref([
    {
        title: '#',
        key: 'key',
        render: (_: any, index: any) => {
            return `${index + 1}`
        }
    },
    {
        title: '难度',
        key: 'type',
        render(row: any) {
            if (!row.typeName) return;
            return h(
                'div',
                [
                    h(
                        NTag,
                        {
                            color: renderColor(row.typeName),
                            size: 'small',
                        },
                        { default: () => row.typeName }
                    ),
                ]
            );
        },
    },
    {
        title: '地图',
        key: 'name'
    },
    {
        title: '译名',
        key: 'label'
    },
    {
        title: '图片',
        key: 'mapUrl',
        render(rowData: any) {
            return h(NImage, {
                src: rowData.mapUrl,
                width: 200,
                height: 100,
            })
        }
    },
    {
        title: '标签',
        key: 'tag',
        render(rowData: any) {
            return h('span', {
                class: "d_flex"
            }, rowData.tagName ? rowData.tagName.split(",").filter((item: any) => item != null && item != '').map((item: any) => {
                return h(
                    NTag,
                    {
                        size: 'small',
                        type: "success",
                        class: "ml-5"
                    },
                    { default: () => item }
                )
            }) : ""
            )
        }
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
                            renderIcon: renderIcon(CopyOutline),
                            onClick: () => onCopy(row)
                        },
                        { default: () => '复制地图名称' }
                    ),
                ]
            );
        },
    }
])
//分页对象
const queryParam = ref({
    pageNum: 1,
    pageSize: 10,
    count: 0,
    pageSizes: [10, 20, 30, 50],
    label: null,
    modeId: null,
    type: null,
    tag: null
})

//select配置项
const selectOption = ref<CustomType>({
    //模式列表
    mode: [],
    //难度列表
    type: [],
    //标签列表
    tag: []
})

//注册图标
const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
}

//注册tag颜色
const renderColor = (typeName: string) => {
    switch (typeName) {
        case '简单':
            return {
                color: "#f6ffed",
                borderColor: "#b7eb8f",
                textColor: "#389e0d"
            }
        case '普通':
            return {
                color: "#e6fffb",
                borderColor: "#87e8de",
                textColor: "#08979c"
            }
        case '困难':
            return {
                color: "#fff0f6",
                borderColor: "#ffadd2",
                textColor: "#c41d7f"
            }
        case '高难':
            return {
                color: "#fff2e8",
                borderColor: "#ffbb96",
                textColor: "#d4380d"
            }
        case '极难':
            return {
                color: "#fff1f0",
                borderColor: "#ffa39e",
                textColor: "#cf1322"
            }
        case '至难':
            return {
                color: "#f9f0ff",
                borderColor: "#d3adf7",
                textColor: "#531dab"
            }
        case '绝难':
            return {
                color: "#fffbe6",
                borderColor: "#ffe58f",
                textColor: "#d48806"
            }
        default:
            return {
                color: '',
                borderColor: '',
                textColor: ''
            }
    }
}

// 切换个数
const onSizeChange = (size: number) => {
    queryParam.value.pageSize = size;
    init();
};

// 切换页数
const onCurrentChange = (page: number) => {
    queryParam.value.pageNum = page;
    init();
}

//清空搜索条件
const onClear = () => {
    queryParam.value.modeId = null;
    queryParam.value.label = null;
    queryParam.value.tag = null;
    queryParam.value.type = null;
}

//搜索
const onSearch = async () => {
    //查询地图
    let { pageNum, pageSize, modeId, label, type, tag } = queryParam.value
    const query = { pageNum, pageSize, modeId, label, type, tag }
    let mapResult: any = await listMap(query)
    mapData.value = mapResult.rows
    //计算总页数
    queryParam.value.count = Math.ceil(mapResult.total / pageSize)
}

//复制连接指令
const onCopy = async (row: any) => {
    try {
        await navigator.clipboard.writeText(row.name);
        notification.success({
            content: '复制成功',
            meta: '已复制地图名称.',
            duration: 1500,
            keepAliveOnHover: true
        })
    } catch (err) {
        notification.error({
            content: '复制失败',
            meta: '复制地图名称失败.',
            duration: 1500,
            keepAliveOnHover: true
        })
    }
}

//配置项初始化
const optionInit = async () => {
    //获取所有地图标签
    let tagResult: any = await listTagEnum()
    selectOption.value.tag = Object.entries(tagResult.data).map(([key, value]) => ({
        value: key,
        label: value
    }));
    //获取所有模式
    let modeResult: any = await listModeEnum()
    selectOption.value.mode = Object.entries(modeResult.data).map(([key, value]) => ({
        value: key,
        label: value
    }));

    //获取所有难度
    let typeResult: any = await listTypeEnum()
    selectOption.value.type = Object.entries(typeResult.data).map(([key, value]) => ({
        value: key,
        label: value
    }));
}

//数据初始化
const init = async () => {
    //查询地图
    let { pageNum, pageSize, modeId, label, type, tag } = queryParam.value
    const query = { pageNum, pageSize, modeId, label, type, tag }
    let mapResult: any = await listMap(query)
    mapData.value = mapResult.rows
    //计算总页数
    queryParam.value.count = Math.ceil(mapResult.total / pageSize)
}
onMounted(() => {
    optionInit()
    init()
})
</script>

<style scoped lang="scss">
.mapPage {
    height: auto;

    .title {
        font-size: 16px;
        font-weight: bolder
    }
}
</style>