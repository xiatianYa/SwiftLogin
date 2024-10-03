<template>
    <div class="headerPage">
        <n-layout-sider bordered collapse-mode="width" style="height: 100%;" :collapsed-width="64" :width="200"
            :collapsed="collapsed" show-trigger @collapse="collapsed = true" @expand="collapsed = false">
            <n-menu v-model:value="activeKey" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
                :options="menuOptions" />
        </n-layout-sider>
        <!-- 登录框 -->
        <n-modal v-model:show="showLogin">
            <n-card style="width: 350px; position: fixed; top: 15%; left: 50%;transform: translateX(-50%);" title="登录"
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
    </div>
</template>

<script setup lang="ts">
import useStore from "@/store";
import QC from '@/assets/js/qqAuth.js';
import type { Component } from 'vue'
import { h, ref, onMounted } from 'vue'
import { NIcon, NMenu, NSwitch, NModal, NCard, useMessage, NLayoutSider } from 'naive-ui'
import { RouterLink } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import {
    Home as HomeIcon,
    GameControllerOutline as GameIcon,
    BriefcaseOutline as BriefcaseIcon,
    MapOutline as MapIcon,
    PeopleCircleOutline as PeopleCircleIcon,
    PersonCircleSharp as PersonCircleIcon,
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

//隐藏菜单
const collapsed = ref(true)

//提示框
const message = useMessage()

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
        label: "服务器查询",
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
        label: "工具箱",
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
    {
        label: () => h(
            'a',
            {
                strong: true,
                style: { marginRight: '10px' },
                onClick: userStore.id ? goUserInfo : openLogin
            },
            { default: () => userStore.id ? '我的' : '点击登录' }
        ),
        key: "login",
        icon: renderIcon(PersonCircleIcon),
    },
    {
        label: () =>
            h(
                NSwitch,
                {
                    size: "large",
                    value: globalStore.nightCycle,
                    onUpdateValue: handleCycle,
                    defaultValue: globalStore.nightCycle,
                }
            ),
        key: "nightCycle"
    },
]

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

//前往用户信息页面
const goUserInfo = () => {

}
onMounted(() => {
    checkLogin();
})


</script>

<style scoped lang="scss">
.headerPage {
    height: 100vh;
}

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