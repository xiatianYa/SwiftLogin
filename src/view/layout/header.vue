<template>
    <div class="headerPage">
        <n-split :default-size="0.85">
            <template #1>
                <n-menu v-model="activeKey" mode="horizontal" :options="menuOptions" responsive :inverted="inverted" />
            </template>
            <template #2>
                <n-space style="height: 100%;" class="d_flex_ac ml-10" :wrap="false">
                    <n-switch size="large" v-model:value="globalStore.nightCycle" :on-update:value="handleCycle"
                        :default-value="globalStore.nightCycle" :round="false">
                        <template #checked-icon>
                            🌞
                        </template>
                        <template #unchecked-icon>
                            🌝
                        </template>
                    </n-switch>
                    <div class="d_flex_ac ml-10" style="cursor: pointer;" @click="openLogin" v-if="!userStore.token">
                        <n-icon :component="PersonCircleIcon" icon-color="#a5aaa3" :size="30" />
                        <span class="ml-5" style="font-size: 14px;font-weight: 400;">点击登录</span>
                    </div>
                    <div class="d_flex_ac ml-10" v-else>
                        <n-dropdown :options="userOptions" @select="handleSelect">
                            <n-avatar round size="small" :src="userStore.avatar" />
                        </n-dropdown>
                        <n-ellipsis style="max-width: 100px;font-size: 14px;font-weight:600;" class="ml-5">
                            {{ userStore.nickName }}
                        </n-ellipsis>
                    </div>
                </n-space>
            </template>
        </n-split>
        <!-- 登录框 -->
        <n-modal v-model:show="showLogin">
            <n-card style="width: 400px; position: fixed; top: 15%; left: 50%;transform: translateX(-50%);" title="登录"
                :bordered="false" size="huge" role="dialog" aria-modal="true" transform-origin="center" closable
                @close="showLogin = false">
                <div class="qq-btn" @click="qqLogin">
                    <svg class="icon pointer mr-5" aria-hidden="true">
                        <use xlink:href="#icon-iconQQ"></use>
                    </svg>
                    <span>
                        通过 QQ 登录
                    </span>
                </div>
            </n-card>
        </n-modal>
        <!-- 聊天框 -->
    </div>
</template>

<script setup lang="ts">
import useStore from "@/store";
import QC from '@/assets/js/qqAuth.js';
import type { Component } from 'vue'
import { h, ref, onMounted } from 'vue'
import { NIcon, NMenu, NSplit, NSpace, NSwitch, NModal, NCard, useMessage, NAvatar, NDropdown, NEllipsis } from 'naive-ui'
import { RouterLink } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import {
    Home as HomeIcon,
    GameControllerOutline as GameIcon,
    BriefcaseOutline as BriefcaseIcon,
    MapOutline as MapIcon,
    PeopleCircleOutline as PeopleCircleIcon,
    PersonCircleSharp as PersonCircleIcon,
    LogOutOutline as LogoutIcon,
    VideocamOutline as VideocamIcon,
    Menu as MenuIcon
} from '@vicons/ionicons5'
import { oauthLogin } from "@/api/user";
import { setExpiresIn, setToken } from "@/utils/auth";
import { useRouter } from "vue-router";


//全局仓库
let { globalStore, userStore } = useStore()

//注册图标
const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
}

//路由
const Router = useRouter()

//提示框
const message = useMessage()

const inverted = ref(false)

const showLogin = ref(false)

const activeKey = ref<string | null>(null)

const menuOptions: MenuOption[] = [
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'main',
                        params: {
                            lang: 'zh-CN'
                        }
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
                        name: 'cs2',
                        params: {
                            lang: 'zh-CN'
                        }
                    }
                },
                { default: () => '服务器查询' }
            ),
        key: 'server',
        icon: renderIcon(GameIcon),
        children: [
            {
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                name: 'cs2',
                                params: {
                                    lang: 'zh-CN'
                                }
                            }
                        },
                        { default: () => 'CSGO2' }
                    ),
                key: 'cs2',
            },
        ]
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'bindKey',
                        params: {
                            lang: 'zh-CN'
                        }
                    }
                },
                { default: () => '工具箱' }
            ),
        key: 'tool',
        icon: renderIcon(BriefcaseIcon),
        children: [
            {
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                name: 'bindKey',
                                params: {
                                    lang: 'zh-CN'
                                }
                            }
                        },
                        { default: () => '绑键助手' }
                    ),
                key: 'bindKey',
            },
        ]
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'map',
                        params: {
                            lang: 'zh-CN'
                        }
                    }
                },
                { default: () => '地图列表' }
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
                        params: {
                            lang: 'zh-CN'
                        }
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
                        name: 'communityMenu',
                        params: {
                            lang: 'zh-CN'
                        }
                    }
                },
                { default: () => '社区导航' }
            ),
        key: 'community_menu',
        icon: renderIcon(MenuIcon),
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

const userOptions = [
    {
        label: '退出登录',
        key: 'logout',
        icon: renderIcon(LogoutIcon),
    }
]
//处理用户菜单操作
const handleSelect = (key: string | number) => {
    if (String(key) === "logout") {
        logOut();
    }
}

//打开用户登录框
const openLogin = () => {
    showLogin.value = true;
}

//控制白天模式 / 黑夜模式 
const handleCycle = (value: boolean) => {
    globalStore.nightCycle = value;
}
//QQ登录
const qqLogin = () => {
    //调用第三方登录框
    QC.Login.showPopup({
        appId: "102129326",// 填写在QQ互联上申请的AppId
        redirectURI: "https://www.bluearchive.top/main", //填写回调地址 登录成功后会自动跳往该地址
    });
}
//检测第三方登录
const checkLogin = () => {
    //检测用户是否确认登录
    if (QC.Login.check()) {
        //获取用户openId
        QC.Login.getMe(function (openId: any, accessToken: any) {
            //成功获取用户openId
            if (openId !== undefined) {
                //openId 是用户的唯一标识，也是需要存到数据库的
                // 用JS SDK调用OpenAPI
                const qqParam = {
                    accessToken: accessToken,
                    openId: openId,
                    type: 0
                }
                //调用后台接口 把用户存入数据库 并且返回token
                oauthLogin(qqParam).then(res => {
                    let result = res.data
                    //设置Token
                    setToken(result.access_token)
                    //设置Token过期时间
                    setExpiresIn(result.expires_in)
                    //设置本地仓库Token
                    userStore.setToken(result.access_token)
                    //提示用户信息
                    message.success("登录成功")
                    //调整路由
                    Router.push({ path: '/' })
                }).catch(error => {
                    //提示用户信息
                    message.error(error)
                })
            }
        })
    }
}
//用户退出登录
const logOut = () => {
    //清除本地缓存
    userStore.logOut();
    //清除第三方登录
    QC.Login.signOut();
    //清除websocket连接
    globalStore.clostChatSocket();
    //提示
    message.success("退出成功");
}
onMounted(() => {
    checkLogin();
})


</script>

<style scoped lang="scss">
.qq-btn {
    display: flex;
    align-items: center;
    background-color: #179ee7;
    padding: 6px 17px;
    border-radius: 6px;
    cursor: pointer;

    .icon {
        width: 20px;
        height: 20px;
    }

    span {
        font-size: 14px;
        font-weight: 400;
    }
}
</style>