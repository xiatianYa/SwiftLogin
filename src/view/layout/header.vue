<template>
    <div class="headerPage">
        <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="9999" :inverted="inverted">
            <n-menu v-model="activeKey" mode="horizontal" :options="menuOptions" responsive :inverted="inverted" />
        </n-layout-sider>
    </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { h, ref } from 'vue'
import { NIcon, NMenu, NLayoutSider } from 'naive-ui'
import { RouterLink } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import {
    Home as HomeIcon,
    GameControllerOutline as GameIcon,
    BriefcaseOutline as BriefcaseIcon,
    ChatboxEllipsesOutline as ChatIcon,
    MapOutline as MapIcon,
    VideocamOutline as VideocamIcon,
} from '@vicons/ionicons5'

const inverted = ref(false)
const activeKey = ref<string | null>(null)

//注册图标
const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
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
]

</script>

<style scoped lang="scss">
</style>