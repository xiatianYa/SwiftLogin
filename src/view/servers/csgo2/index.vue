<template>
    <!-- csgo2 -->
    <div class="csgo2Page">
        <!-- 数据统计 -->
        <div class="d_flex_ac d_flex_sb mb-20">
            <div class="title">服务器列表</div>
            <n-statistic label="在线人数" :tabular-nums="true">
                <n-number-animation ref="numberAnimationInstRef" :from="0" :to="playNumber" :duration="1000" />
                <template #suffix>
                    / {{ maxPlayNumber }}
                </template>
            </n-statistic>
        </div>
        <!-- 搜索 -->
        <div class="d_flex d_flex_sb mb-20">
            <n-select class="mr-10" v-model:value="queryParams.communityId" :options="selectOption.community"
                placeholder="请选择社区" clearable @update:value="handleUpdateValue" />
            <n-select class="mr-10" v-model:value="queryParams.modeId" :options="selectOption.mode" placeholder="请选择模式"
                clearable @update:value="handleUpdateValue" />
            <n-button class="mr-10" strong secondary type="primary" :render-icon="renderIcon(MapOutline)"
                @click="onMap">
                地图订阅
            </n-button>
            <n-button strong secondary type="info" :render-icon="renderIcon(Search)" @click="onSearch">
                搜索
            </n-button>
        </div>
        <!-- 表格 -->
        <div>
            <n-spin :show="loading" :size="'large'" style="min-height: 50vh;">
                <reuseTable :tableColumns="serverColumns" :tableData="serverData" :rowClassName="rowClassName"
                    v-show="!loading" />
                <template #description>
                    加载中,请耐心等待...
                </template>
            </n-spin>
        </div>
        <!-- 自动挤服 / 挂机模式 抽屉 -->
        <n-drawer v-model:show="automaticDialog" :width="502" placement="right" :on-after-leave="handleDrawerClose">
            <n-drawer-content :title="globalStore.automaticInfo.name" closable>
                <n-card :bordered="false">
                    <n-space class="mb-10">
                        <span>
                            地图名称 : {{ globalStore.automaticInfo.map }}
                        </span>
                        <span>
                            译名 : {{ globalStore.automaticInfo.mapName }}
                        </span>
                    </n-space>
                    <n-space class="mb-10 d_flex_ac d_flex_sb">
                        <n-image width="240" height="100%" :src="globalStore.automaticInfo.mapUrl"
                            v-if="globalStore.automaticInfo.mapUrl" />
                        <n-progress type="circle"
                            :color="getProgressColor(((globalStore.automaticInfo.players / globalStore.automaticInfo.maxPlayers) * 100))"
                            :percentage="((globalStore.automaticInfo.players / globalStore.automaticInfo.maxPlayers) * 100)">
                            <span style="font-weight: 700;">当前在线人数:{{ globalStore.automaticInfo.players }}</span>
                        </n-progress>
                    </n-space>
                    <n-space class="mb-10" vertical>
                        <n-input-number class="mb-5" v-model:value="globalStore.automaticInfo.minPlayers"
                            :disabled="globalStore.isAutomatic || globalStore.isAutoHook"
                            placeholder="最小玩家数 (小于或于时自动进入服务器)" :min="0" clearable>
                            <template #minus-icon>
                                <n-icon :component="ArrowDownCircleOutline" />
                            </template>
                            <template #add-icon>
                                <n-icon :component="ArrowUpCircleOutline" />
                            </template>
                        </n-input-number>
                        <n-input-number class="mb-5" v-model:value="globalStore.automaticInfo.automaticIntervalNumber"
                            :disabled="globalStore.isAutomatic || globalStore.isAutoHook"
                            placeholder="挂机间隔 (每隔多少分钟重新进入服务器)" :min="1" clearable>
                            <template #minus-icon>
                                <n-icon :component="ArrowDownCircleOutline" />
                            </template>
                            <template #add-icon>
                                <n-icon :component="ArrowUpCircleOutline" />
                            </template>
                        </n-input-number>
                    </n-space>
                    <n-space class="mb-10">
                        <div class="d_flex_ac">
                            <span class="mr-5">
                                自动挤服
                            </span>
                            <n-switch v-model:value="globalStore.isAutomatic" size="large"
                                :disabled="globalStore.isAutoHook" :on-update:value="handleAutomaticPersonnel">
                                <template #checked-icon>
                                    <n-icon :component="CaretBackCircleOutline" />
                                </template>
                                <template #unchecked-icon>
                                    <n-icon :component="CaretForwardCircleOutline" />
                                </template>
                            </n-switch>
                        </div>
                        <div class="d_flex_ac">
                            <span class="mr-5">
                                自动挂机
                            </span>
                            <n-switch v-model:value="globalStore.isAutoHook" size="large"
                                :disabled="globalStore.isAutomatic" :on-update:value="handleAutomaticInterval">
                                <template #checked-icon>
                                    <n-icon :component="CaretBackCircleOutline" />
                                </template>
                                <template #unchecked-icon>
                                    <n-icon :component="CaretForwardCircleOutline" />
                                </template>
                            </n-switch>
                        </div>
                        <div class="d_flex_ac d_flex_c">
                            <n-popover trigger="hover" placement="bottom-start">
                                <template #trigger>
                                    <n-icon size="25">
                                        <InformationCircleOutline />
                                    </n-icon>
                                </template>
                                <span>
                                    自动挤服：<br>
                                    功能说明：此功能允许您设定一个最小玩家数。当服务器内玩家数量减少到或低于此数时，系统将自动尝试进入该服务器。<br>
                                    配置要点：<br>
                                    仅需设置“最小玩家数”即可启用此功能。<br>
                                    需要浏览器通知权限(重点),推荐默认允许打开!<br>
                                    <br>
                                    自动挂机：<br>
                                    功能说明：除了设定最小玩家数外，您还可以设置挂机间隔。每当达到设定的间隔时间，系统会检查当前服务器玩家数。若玩家数低于或等于设定的最小玩家数，系统将自动尝试进入服务器以进行挂机。<br>
                                    配置要点：<br>
                                    设置“最小玩家数”。<br>
                                    设置“挂机间隔”（即两次尝试进入服务器之间的时间间隔）。<br>
                                    浏览器兼容性：请注意，此自动挂机功能在谷歌浏览器中可能不可用。为获得最佳体验，推荐使用Microsoft Edge浏览器进行挂机操作。<br>
                                    需要浏览器通知权限(重点),推荐默认允许打开!<br>
                                </span>
                            </n-popover>
                        </div>
                    </n-space>
                    <n-space class="mt-10">
                        <span>
                            尝试次数 : {{ globalStore.automaticCount }}
                        </span>
                        <span>
                            挂机次数 : {{ globalStore.onHookNumber }}
                        </span>
                    </n-space>
                </n-card>
            </n-drawer-content>
        </n-drawer>
        <!-- 地图订阅 -->
        <n-drawer v-model:show="mapDialog" :width="502" placement="right" :on-after-leave="handleDrawerClose">
            <n-drawer-content title="地图订阅" closable>
                <n-card :bordered="false">
                    <n-space vertical class="mb-10">
                        <n-select :value="globalStore.autoMapInfo?.label || null" filterable placeholder="选择地图"
                            :disabled="globalStore.isAutoMap" :options="selectOption.map"
                            @update:value="handleUpdateMapValue" clearable />
                    </n-space>
                    <n-space>
                        <div class="d_flex" v-if="globalStore.autoMapInfo">
                            <n-image width="220" height="100%" class="mr-5" :src="globalStore.autoMapInfo.mapUrl"
                                v-if="globalStore.autoMapInfo.mapUrl" />
                            <div>
                                <div>
                                    地图名 : {{ globalStore.autoMapInfo.value }}
                                </div>
                                <div class="mt-5">
                                    地图译名 :{{ globalStore.autoMapInfo.label }}
                                </div>
                                <div class="mt-5">
                                    <n-tag :color="renderColor(globalStore.autoMapInfo.typeName)" size="small"
                                        class="mr-5">{{
                                            globalStore.autoMapInfo.typeName }}</n-tag>
                                    <n-tag size="small" type="success" class="mr-5"
                                        v-for="item in globalStore.autoMapInfo?.tagName?.split(',').filter((item: any) => item != null && item != '')">{{
                                            item }}</n-tag>
                                </div>
                            </div>
                        </div>
                    </n-space>
                    <n-space class="mt-5">
                        <div class="d_flex_ac">
                            <span class="mr-5">
                                地图订阅
                            </span>
                            <n-switch v-model:value="globalStore.isAutoMap" size="large"
                                :on-update:value="handleAutomaticMap">
                                <template #checked-icon>
                                    <n-icon :component="CaretBackCircleOutline" />
                                </template>
                                <template #unchecked-icon>
                                    <n-icon :component="CaretForwardCircleOutline" />
                                </template>
                            </n-switch>
                        </div>
                        <div class="d_flex_ac d_flex_c">
                            <n-popover trigger="hover" placement="bottom-start">
                                <template #trigger>
                                    <n-icon size="25">
                                        <InformationCircleOutline />
                                    </n-icon>
                                </template>
                                <span>
                                    地图订阅：<br>
                                    功能说明：此功能允许您选择一个地图,在获取到地图更新时立即加入服务器(不适用当前地图已存在,且人数过高,会导致进服失败!)。<br>
                                    配置要点：<br>
                                    仅需选择“地图”即可启用此功能。<br>
                                    需要浏览器通知权限(重点),推荐默认允许打开!<br>
                                    只能订阅你目前勾选的社区进行订阅(页面所展示的服务器)!<br>
                                </span>
                            </n-popover>
                        </div>
                    </n-space>
                </n-card>
            </n-drawer-content>
        </n-drawer>
    </div>
</template>

<script setup lang="ts">
import reuseTable from '@/components/reuseTable/index.vue'
import gameSocket from '@/utils/gameSocket'
import useStore from "@/store";
import { listModeEnum, listTagEnum } from '@/api/enum'
import { listCommunity } from '@/api/community'
import { listServer } from '@/api/server'
import { listMap } from '@/api/map'
import { getServerInfo } from '@/api/steamApi'
import { CustomType } from "@/types";
import type { Component } from 'vue'
import { ref, h, onMounted, watch } from 'vue';
import { NSelect, NButton, NIcon, NImage, NSpin, NProgress, useNotification, NDrawer, NDrawerContent, NCard, NSpace, NSwitch, NInputNumber, NStatistic, NNumberAnimation, NPopover, useMessage, NTag, SelectOption } from 'naive-ui';
import { Search, AlarmOutline, MapOutline, CopyOutline, EnterOutline, ArrowDownCircleOutline, ArrowUpCircleOutline, CaretForwardCircleOutline, CaretBackCircleOutline, InformationCircleOutline } from '@vicons/ionicons5';
import { RowData } from 'naive-ui/es/data-table/src/interface';

//全局仓库
let { globalStore } = useStore();

//普通消息
const message = useMessage()

//消息弹出框
const notification = useNotification()

//统计在线人数
const playNumber = ref(0)

//统计最大人数
const maxPlayNumber = ref(0)

//自动挤服 / 挂机模式 抽屉
const automaticDialog = ref(false)

//地图订阅 抽屉
const mapDialog = ref(false)

//数据是否加载
const loading = ref(false)

// 查询参数
const queryParams = ref<any>({
    pageNum: 1,
    pageSize: 999,
    communityId: 3,
    modeId: null,
})

//服务器信息定时任务
const getServerInterval = ref()

//挂机模式定时任务
const getOnHookInterval = ref()

//服务器表格数据
const serverData = ref<any>([])

//select配置项
const selectOption = ref<CustomType>({
    //社区列表
    community: [],
    //地图列表
    map: [],
    //模式列表
    mode: [],
    //标签列表
    tag: []
})

//服务器表格字段
const serverColumns = ref([
    {
        type: 'expand',
        expandable: (rowData: any) => rowData.players !== '获取失败!' && rowData.mapName !== '暂无译名',
        renderExpand: (rowData: any) => {
            return h('div', [
                h('div', {
                    class: "d_flex_ac d_flex_column",
                    style: {
                        width: '30%'
                    }
                }, [
                    //左侧盒子
                    h('div', {
                        class: "d_flex_ac d_flex_column ml-80",
                        style: {
                            width: "100%"
                        }
                    },
                        [
                            h('h4', rowData.map),
                            h('h4', "(" + rowData.mapName + ")"),
                            h('div', {
                                class: "d_flex"
                            }, [
                                h(NImage, {
                                    src: rowData.mapUrl,
                                    width: 200,
                                    class: "mr-10 mt-10"
                                }),
                                h('div', {
                                    class: "d_flex mt-10"
                                }, [
                                    h('span', {
                                        class: "d_flex"
                                    }, [
                                        h(
                                            NTag,
                                            {
                                                color: renderColor(rowData.typeName),
                                                size: 'small',
                                            },
                                            { default: () => rowData.typeName }
                                        )
                                    ]),
                                    h('span', {
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
                                ])
                            ])
                        ]),
                ]),
                //右侧盒子
                h('div', {
                    style: {
                        width: '70%'
                    }
                }, [

                ])
            ]
            )
        }
    },
    {
        title: '模式',
        key: 'modeName',
        sorter: (row1: any, row2: any) => row1.modeName > row2.modeName

    },
    {
        title: '服务器名称',
        key: 'name'
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
        title: '地图名',
        key: 'map'
    },
    {
        title: '译名',
        key: 'mapName'
    },
    {
        title: '人数',
        key: 'peopleNumber',
        render(row: any) {
            return h(
                'span',
                {

                },
                { default: () => row.players + "/" + row.maxPlayers }
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
                            renderIcon: renderIcon(EnterOutline),
                            onClick: () => onPlay(row)
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
                            onClick: () => onCopy(row)
                        },
                        { default: () => '复制连接指令' }
                    ),
                    h(
                        NButton,
                        {
                            strong: true,
                            tertiary: true,
                            size: 'small',
                            type: 'info',
                            style: { marginRight: '10px' },
                            renderIcon: renderIcon(AlarmOutline),
                            onClick: () => onAutomatic(row)
                        },
                        { default: () => '自动挤服 / 挂机模式' }
                    )
                ]
            );
        },
    }
])

//开启自动挤服
const handleAutomaticPersonnel = (value: boolean) => {
    //关闭挤服
    if (!value) {
        //清除挤服次数
        globalStore.automaticCount = 0;
        globalStore.isAutomatic = value;
        return;
    }
    //未填写挤服人数
    if (!globalStore.automaticInfo.minPlayers) {
        message.warning("请填最小玩家数!")
        return;
    }
    //发送消息 开始主动挤服
    globalStore.isAutomatic = value;
    gameSocket.sendMessage(globalStore.automaticInfo);
}

//开启自动挂机
const handleAutomaticInterval = (value: boolean) => {
    //关闭主动挂机
    if (!value) {
        //清除挤服次数
        globalStore.onHookNumber = 0;
        globalStore.automaticCount = 0;
        globalStore.isAutoHook = value;
        //清空定时任务
        clearInterval(getOnHookInterval.value);
        return;
    }
    //未填写挤服人数
    if (!globalStore.automaticInfo.minPlayers) {
        message.warning("请填最小玩家数!");
        return;
    }
    //为填写挂机间隔
    if (!globalStore.automaticInfo.automaticIntervalNumber) {
        message.warning("请填写挂机间隔!");
        return;
    }
    //开启 挂机定时任务
    globalStore.isAutoHook = value;
    getOnHookInterval.value = setInterval(async () => {
        //设置全局挤服
        globalStore.isAutomatic = true;
        globalStore.onHookNumber++;
        //开始挤服
        gameSocket.sendMessage(globalStore.automaticInfo);
    }, globalStore.automaticInfo.automaticIntervalNumber * 60000);
}

//开启/关闭 自动订阅地图
const handleAutomaticMap = (value: boolean) => {
    if (!globalStore.autoMapInfo) {
        message.warning('请选择订阅地图')
        return;
    }
    if (value) {
        message.success("地图订阅已开启")
    } else {
        message.info("地图订阅已关闭")
    }
    globalStore.isAutoMap = value;
}

//抽屉关闭的回调函数
const handleDrawerClose = () => {
    //清空 关闭 各种定时任务 数据
    globalStore.initGlobal();
}

//选择地图订阅
const handleUpdateMapValue = (_value: string, option: SelectOption) => {
    globalStore.autoMapInfo = JSON.parse(JSON.stringify(option))
}

//打开地图订阅
const onMap = () => {
    //Websocket不存在
    if (!gameSocket.websocket) {
        message.error('服务器连接失败,请刷新页面!')
        return;
    };
    mapDialog.value = true;
}

//搜索服务器信息
const onSearch = () => {
    init()
}

//改变配置自动搜索
const handleUpdateValue = () => {
    //避免bug 清除定时器任务
    clearInterval(getServerInterval.value);
    getServerInterval.value = null; // 可选，但有助于避免潜在的bug  
    onSearch();
}

//打开 自动挤服 / 挂机模式
const onAutomatic = (row: any) => {
    //Websocket不存在
    if (!gameSocket.websocket) {
        message.error('服务器连接失败,请刷新页面!')
        return;
    };
    globalStore.automaticInfo = row;
    automaticDialog.value = true;
}

//连接服务器
const onPlay = (row: any) => {
    message.success("成功连接")
    const aLink = document.createElement('a');
    aLink.href = "steam://rungame/730/76561198977557298/+connect " + row.ip + ":" + row.port;
    aLink.click();
}

//复制连接指令
const onCopy = async (row: any) => {
    try {
        await navigator.clipboard.writeText('connect ' + row.ip + ":" + row.port);
        notification.success({
            content: '复制成功',
            meta: '已复制连接指令.',
            duration: 1500,
            keepAliveOnHover: true
        })
    } catch (err) {
        notification.error({
            content: '复制失败',
            meta: '复制连接指令失败.',
            duration: 1500,
            keepAliveOnHover: true
        })
    }
}

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

//计算进度颜色
const getProgressColor = (progress: any) => {
    if (progress <= 30) {
        return '#2fef10';
    } else if (progress <= 50) {
        return '#a9f604'
    } else if (progress <= 80) {
        return '#ff4f00'
    } else {
        return '#ff0000'
    }
}

//自动获取列表服务器信息
const startInterval = () => {
    //开启定时任务 持续获取服务器信息
    getServerInterval.value = setInterval(async () => {
        //获取所有服务器
        let serverResult: any = await listServer(queryParams.value)
        serverResult = serverResult.rows.map((item: any) => {
            return {
                ...item,
                map: "获取失败!",
                mapName: "获取失败",
                players: 0,
                maxPlayers: 0
            }
        })
        //处理服务器路径参数
        let paths = serverResult.map((item: any) => {
            let { ip, port } = item;
            return ip + ":" + port
        })

        //初始化服务器参数
        let responsePromise: any = await getServerInfo(paths);

        playNumber.value = 0;
        maxPlayNumber.value = 0;
        responsePromise.map((item: any) => {
            //获取服务器信息
            let serverInfo = item.response.servers
            if (!serverInfo) return;
            //获取服务器地址 地图名 在线玩家 最大玩家
            let { addr, map, players, max_players } = serverInfo[0]
            serverInfo = serverResult.find((item: any) => item.ip + ":" + item.port == addr);
            serverInfo.key = serverInfo.id;
            serverInfo.map = map;
            serverInfo.players = players;
            serverInfo.maxPlayers = max_players;
            //获取地图译名
            let mapName = selectOption.value.map.find((item: any) => item.value == serverInfo.map);
            serverInfo.mapUrl = mapName?.mapUrl ? mapName.mapUrl : "";
            serverInfo.tagName = mapName?.tagName ? mapName.tagName : "";
            serverInfo.typeName = mapName ? mapName.typeName : '';
            serverInfo.mapName = mapName ? mapName.label : '暂无译名';
            //配置表头在线人数
            playNumber.value += players;
            maxPlayNumber.value += max_players;
        })
        serverData.value = serverResult;
    }, 6000); // 每6秒执行一次  
}

//配置项初始化
const optionInit = async () => {
    //获取所有游戏社区
    let communityResult: any = await listCommunity(queryParams.value)
    selectOption.value.community = communityResult.rows.map((item: any) => {
        let { id, name } = item
        return {
            value: id,
            label: name
        }
    })
    //获取所有的地图
    let mapResult: any = await listMap(queryParams.value)
    selectOption.value.map = mapResult.rows.map((item: any) => {
        let { name, label, tagName, typeName, mapUrl } = item;
        return {
            value: name.trim(),
            label,
            tagName,
            mapUrl,
            typeName
        }
    })
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
    if (localStorage.getItem("community")) {
        queryParams.value.communityId = Number(localStorage.getItem("community"))

    }
    if (localStorage.getItem("mode")) {
        queryParams.value.modeId = localStorage.getItem("mode")
    }
}

//初始化
const init = async () => {
    loading.value = true;
    //获取所有服务器
    let serverResult: any = await listServer(queryParams.value)
    serverResult = serverResult.rows.map((item: any) => {
        return {
            ...item,
            map: "获取失败!",
            mapName: "获取失败",
            players: 0,
            maxPlayers: 0
        }
    })
    //处理服务器路径参数
    let paths = serverResult.map((item: any) => {
        let { ip, port } = item;
        return ip + ":" + port
    })

    //初始化服务器参数
    let responsePromise: any = await getServerInfo(paths);

    playNumber.value = 0;
    maxPlayNumber.value = 0;
    responsePromise.map((item: any) => {
        //获取服务器信息
        let serverInfo = item.response.servers
        if (!serverInfo) return;
        //获取服务器地址 地图名 在线玩家 最大玩家
        let { addr, map, players, max_players } = serverInfo[0]
        serverInfo = serverResult.find((item: any) => item.ip + ":" + item.port == addr);
        serverInfo.key = serverInfo.id;
        serverInfo.map = map;
        serverInfo.players = players;
        serverInfo.maxPlayers = max_players;
        //获取地图译名
        let mapName = selectOption.value.map.find((item: any) => item.value == serverInfo.map);
        serverInfo.mapUrl = mapName?.mapUrl ? mapName.mapUrl : "";
        serverInfo.tagName = mapName?.tagName ? mapName.tagName : "";
        serverInfo.typeName = mapName ? mapName.typeName : '';
        serverInfo.mapName = mapName ? mapName.label : '暂无译名';
        //配置表头在线人数
        playNumber.value += players;
        maxPlayNumber.value += max_players;
    })
    serverData.value = serverResult;
    //开启定时任务
    startInterval();
    loading.value = false;
}

//表格自定义样式
const rowClassName = (row: RowData) => {
    if (!row.players && !row.maxPlayers) {
        return 'too-old'
    }
    return '';
}

//地图数据接听
watch(() => serverData.value, (newValue: any, oldValue: any) => {
    //当地图订阅开启
    if (globalStore.isAutoMap && globalStore.autoMapInfo) {
        let mapResult = newValue.find((item: any) => item.map = globalStore.autoMapInfo.value)
        if (mapResult) {
            //清空自动挤服
            globalStore.isAutoMap = false;
            mapDialog.value = false;
            globalStore.autoMapInfo = null;
            // 判断浏览器是否支持唤醒
            if (window.Notification) {
                let popNotice = () => {
                    const notification = new Notification('地图订阅通知', {
                        body: "您所订阅的地图 " + mapResult.mapName + " 已在 " + mapResult.name + " 进行游戏,已为你自动连接服务器。"
                    })
                    // 点击通知的回调函数
                    notification.onclick = () => {
                        window.open('https://www.bluearchive.top')
                        notification.close()
                    }
                }
                /* 授权过通知 */
                if (Notification.permission === 'granted') {
                    popNotice()
                } else {
                    /* 未授权，先询问授权 */
                    Notification.requestPermission(() => {
                        popNotice()
                    })
                }
            }
            // 自动连接服务器
            const aLink = document.createElement("a");
            aLink.href =
                "steam://rungame/730/76561198977557298/+connect " +
                mapResult.ip +
                ":" +
                mapResult.port;
            aLink.click();
        }
    }
    //当打开抽屉地图信息时 
    if (globalStore.automaticInfo) {
        let mapResult = newValue.find((item: any) => item.map == globalStore.automaticInfo.map)
        globalStore.automaticInfo = { ...globalStore.automaticInfo, ...mapResult }
    }
}, { deep: true })

onMounted(async () => {
    //加载开启
    loading.value = true;
    await optionInit()
    await init()
})
</script>

<style scoped lang="scss">
.csgo2Page {
    height: auto;

    .title {
        font-size: 16px;
        font-weight: bolder
    }

    :deep(.too-old td) {
        color: rgba(230, 71, 74, 1) !important;
    }
}
</style>