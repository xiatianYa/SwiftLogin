<template>
  <div class="setup">
    <svg class="icon pointer" aria-hidden="true" @click="setDialog = true">
      <use xlink:href="#icon-shezhi"></use>
    </svg>
    <!-- 菜单 -->
    <transition name="fadenum">
      <div class="setView mb-5">
        <svg class="icon pointer" aria-hidden="true" @click="openChart()" v-show="userStore.id">
          <use xlink:href="#icon-xiaoxi"></use>
        </svg>
      </div>
    </transition>
    <!-- 系统设置 -->
    <n-drawer v-model:show="setDialog" :width="500" placement="right">
      <n-drawer-content title="系统设置">
        <n-card :bordered="false">
          <n-space vertical>
            <n-select class="mb-10" v-model:value="communityId" :options="selectOption.community" placeholder="请选择指定社区"
              clearable />
            <n-select class="mb-10" v-model:value="modeId" :options="selectOption.mode" placeholder="请选择指定模式"
              clearable />
            <n-switch class="mb-10" size="large" v-model:value="globalStore.nightCycle" :on-update:value="handleCycle"
              :default-value="globalStore.nightCycle" :round="false">
              <template #checked-icon>
                🌞
              </template>
              <template #unchecked-icon>
                🌝
              </template>
            </n-switch>
          </n-space>
          <n-space>
            <n-button class="mr-10" strong secondary type="success" :render-icon="renderIcon(SaveOutline)"
              @click="saveSet">
              保存设置
            </n-button>
            <n-button class="mr-10" strong secondary type="error" :render-icon="renderIcon(SaveOutline)"
              @click="clearCache">
              清除缓存
            </n-button>
          </n-space>
        </n-card>
      </n-drawer-content>
    </n-drawer>
    <!-- 聊天框 -->
    <n-drawer v-model:show="chartShow" :width="500" placement="left">
      <n-drawer-content body-content-class="content">
        <template #header>
          <div class="drawer-header-title">
            <div>
              聊天室
            </div>
            <div class="ml-20">
              <n-avatar-group :options="globalStore.onlineUserList" :size="32" :max="20">
                <template #avatar="{ option: { name, src } }">
                  <n-tooltip>
                    <template #trigger>
                      <n-avatar :src="src" />
                    </template>
                    {{ name }}
                  </n-tooltip>
                </template>
                <template #rest="{ options: restOptions, rest }">
                  <n-dropdown :options="createDropdownOptions(restOptions)" placement="top">
                    <n-avatar>{{ rest }}</n-avatar>
                  </n-dropdown>
                </template>
              </n-avatar-group>
            </div>
          </div>
        </template>
        <template #default>
          <div class="drawer-content-chat">
            <n-scrollbar style="max-height: 600px" ref="virtualListInst">
              <div v-for="item, index in globalStore.chatHistory"
                :class="item.fromUserId == userStore.id ? 'itemTwo' : 'itemOne'">
                <n-avatar round :size="32" :src="item.fromUserAvatar" class="avatar" />
                <div>
                  <n-ellipsis
                    :style="item.fromUserId == userStore.id ? 'justify-content:flex-end;' : 'justify-content:flex-start;'"
                    style="display: flex;width: 100%;" :line-clamp="1">
                    {{ item.fromUserNickName }}
                  </n-ellipsis>
                  <n-ellipsis
                    :style="globalStore.nightCycle ? 'background-color: black;color: #fff;' : 'background-color: #fff;color: black;'"
                    style="border-radius: 7px;" :line-clamp="2" class="p-5">
                    {{ item.data }}
                  </n-ellipsis>
                </div>
              </div>
            </n-scrollbar>
          </div>
        </template>
        <template #footer>
          <div class="drawer-footer-bottom">
            <n-input v-model:value="inputMsg" style="width: 300px;" round placeholder="请输入聊天内容" clearable
              @keydown.enter="sendMsgAll()" />
            <n-button round @click="sendMsgAll()">
              发送
            </n-button>
          </div>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script setup lang="ts">
import useStore from "@/store";
import chatEnum from "@/utils/chatEnum";
import { ref, onMounted, Component, h, nextTick, watch } from 'vue'
import { NSelect, NInput, NEllipsis, NScrollbar, NDrawer, NDrawerContent, NCard, NSpace, useMessage, NButton, NIcon, NSwitch, NAvatarGroup, NTooltip, NAvatar, NVirtualList, VirtualListInst } from 'naive-ui';
import { SaveOutline } from '@vicons/ionicons5';
import { CustomType } from '@/types';
import { listModeEnum } from '@/api/enum'
import { listCommunity } from '@/api/community'

//全局仓库
let { globalStore, userStore } = useStore();

//聊天室是否显示
const chartShow = ref(false)

//Dom
const virtualListInst = ref<VirtualListInst>()

//消息对象
const message = useMessage();

//消息体
const inputMsg = ref()

//指定社区
const communityId = ref<any>(null);

//指定模式
const modeId = ref<any>(null)

//抽屉
const setDialog = ref(false);

//select配置项
const selectOption = ref<CustomType>({
  //社区列表
  community: [],
  //模式列表
  mode: []
})

//控制白天模式 / 黑夜模式 
const handleCycle = (value: boolean) => {
  globalStore.nightCycle = value;
}

//创建头像群组
const createDropdownOptions = (options: Array<{ name: string, src: string }>) =>
  options.map(option => ({
    key: option.name,
    label: option.name
  }))

//注册图标
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

//发送消息 
const sendMsgAll = () => {
  //消息数据
  const data = {
    fromUserId: userStore.id,
    data: inputMsg.value,
    type: chatEnum.ChatGroupType
  }
  //校验数据
  if (inputMsg.value.length <= 100 && inputMsg.value.length) {
    globalStore.sendMessage(JSON.stringify(data));
  } else {
    message.warning("消息长度不合规")
  }
  //清空输入框
  inputMsg.value = "";
}

//配置项初始化
const optionInit = async () => {
  //获取所有游戏社区
  let communityResult: any = await listCommunity()
  selectOption.value.community = communityResult.rows.map((item: any) => {
    let { id, name } = item
    return {
      value: id,
      label: name
    }
  })
  //获取所有模式
  let modeResult: any = await listModeEnum()
  selectOption.value.mode = Object.entries(modeResult.data).map(([key, value]) => ({
    value: key,
    label: value
  }));
  if (localStorage.getItem("community")) {
    communityId.value = Number(localStorage.getItem("community"))
  }
  if (localStorage.getItem("mode")) {
    modeId.value = localStorage.getItem("mode")
  }
}

//保存用户设置
const saveSet = () => {
  if (communityId.value) {
    localStorage.setItem("community", communityId.value)
  } else {
    localStorage.removeItem("community")
  }
  if (modeId.value) {
    localStorage.setItem("mode", modeId.value)
  } else {
    localStorage.removeItem("mode")
  }
  if (globalStore.nightCycle != null) {
    localStorage.setItem("nightCycle", String(globalStore.nightCycle))
  } else {
    localStorage.removeItem("nightCycle")
  }
  message.success("设置成功")
}

//清除浏览器缓存
const clearCache = () => {
  //清空浏览器缓存
  localStorage.clear();
  message.success("清除浏览器缓存成功");
  location.replace(location.href);
}

//打开聊天室
const openChart = () => {
  chartShow.value = true
  nextTick(() => {
    virtualListInst.value?.scrollTo({ position: 'bottom' })
  })
}

//监听消息变化 
watch(globalStore.chatHistory, (newValue: any, oldValue: any) => {
  nextTick(() => {
    virtualListInst.value?.scrollTo({ position: 'bottom' })
  })
}, { deep: true })
onMounted(() => {
  optionInit()
})


</script>
<style lang="scss" scoped>
.drawer-header-title {
  display: flex;
  justify-content: center;
  align-items: center;
}

.drawer-content-chat {
  width: 100%;
  height: 100%;
  padding: 10px 15px;

  .itemOne {
    display: flex;
    align-items: center;

    .avatar {
      margin-right: 10px;
    }
  }

  .itemTwo {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;

    .avatar {
      margin-left: 10px;
    }
  }
}

.drawer-footer-bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.setup {
  position: fixed;
  right: 30px;
  bottom: 40px;
  z-index: 99;

  .icon {
    width: 32px;
    height: 32px;
    animation: revolve 2s linear infinite;
    cursor: pointer;
  }

  .setView {
    position: fixed;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 32px;
    right: 30px;
    bottom: 75px;
    opacity: 0;
    transition: opacity 0.4s;
    -webkit-transition: opacity 0.4s;

    .icon {
      width: 26px;
      height: 26px;
      animation: none;
      cursor: pointer;
    }
  }
}

.setup:hover .setView {
  opacity: 1;
}
</style>