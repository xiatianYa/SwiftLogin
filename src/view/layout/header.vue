<template>
    <div class="headerPage">
        <n-split :default-size="0.8">
            <template #1>
                <n-menu v-model="activeKey" mode="horizontal" :options="menuOptions" responsive :inverted="inverted" />
            </template>
            <template #2>
                <n-space style="height: 100%;" class="d_flex_ac ml-10">
                    <n-switch size="large" v-model="globalStore.nightCycle" :on-update:value="handleCycle">
                        <template #checked-icon>
                            <n-icon :component="SunnyOutline" />
                        </template>
                        <template #unchecked-icon>
                            <n-icon :component="MoonOutline" />
                        </template>
                    </n-switch>
                </n-space>
            </template>
        </n-split>
    </div>
</template>

<script setup lang="ts">
import useStore from "@/store";
import type { Component } from 'vue'
import { h, ref } from 'vue'
import { NIcon, NMenu, NSplit, NSpace, NSwitch } from 'naive-ui'
import { RouterLink } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import {
    Home as HomeIcon,
    GameControllerOutline as GameIcon,
    BriefcaseOutline as BriefcaseIcon,
    ChatboxEllipsesOutline as ChatIcon,
    MapOutline as MapIcon,
    VideocamOutline as VideocamIcon,
    PeopleCircleOutline as PeopleCircleIcon,
    SunnyOutline,
    MoonOutline
} from '@vicons/ionicons5'

//全局仓库
let { globalStore } = useStore();

const inverted = ref(false)
const activeKey = ref<string | null>(null)

//注册图标
const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
}
//控制白天模式 / 黑夜模式 
const handleCycle = (value: boolean) => {
    globalStore.nightCycle = value;
}
const menuOptions: MenuOption[] = [
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'main',
                    }
                },
                { default: () => '首页' }
            ),
        key: 'main',
        icon: renderIcon(HomeIcon)
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'servers',
                    }
                },
                { default: () => '服务器查询' }
            ),
        key: 'servers',
        icon: renderIcon(GameIcon),
        children: [
            {
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                name: 'cs2',
                            }
                        },
                        { default: () => 'CSGO2' }
                    ),
                key: 'cs2',
            },
            // {
            //     label: () =>
            //         h(
            //             RouterLink,
            //             {
            //                 to: {
            //                     name: 'projectZomboid',
            //                 }
            //             },
            //             { default: () => '僵尸毁灭工程' }
            //         ),
            //     key: 'projectZomboid',
            // },
            // {
            //     label: () =>
            //         h(
            //             RouterLink,
            //             {
            //                 to: {
            //                     name: '7daysToDie',
            //                 }
            //             },
            //             { default: () => '七日杀' }
            //         ),
            //     key: '7daysToDie',
            // },
        ]
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'tool',
                    }
                },
                { default: () => '工具箱' }
            ),
        key: 'tool',
        icon: renderIcon(BriefcaseIcon),
        children: [
            {
                label: '绑键助手',
                key: 'BindKey'
            }
        ]
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'map',
                    }
                },
                { default: () => '僵尸逃跑地图' }
            ),
        key: 'map',
        icon: renderIcon(MapIcon)
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'live',
                    }
                },
                { default: () => '直播推荐' }
            ),
        key: 'live',
        icon: renderIcon(VideocamIcon)
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'chat',
                    }
                },
                { default: () => '聊天室' }
            ),
        key: 'chat',
        icon: renderIcon(ChatIcon)
    },
    {
        label: () =>
            h(
                'a',
                {
                    href: 'https://qm.qq.com/cgi-bin/qm/qr?k=jARGHlUgKmBc5vHMJZG4oWTxy7cIgJq1&jump_from=webapi&authKey=Jz92LvgbizYMrgquwOg+wH2ofLC514UbcB2vNtBRE6CsCJ2BmOsZXaXyMb5ZVqOe',
                    target: '_blank',
                },
                '登录器反馈'
            ),
        key: '登录器反馈',
        icon: renderIcon(PeopleCircleIcon)
    },
]

</script>

<style scoped lang="scss"></style>