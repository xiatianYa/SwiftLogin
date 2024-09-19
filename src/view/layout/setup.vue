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
        <svg class="icon pointer" aria-hidden="true" @click="openLeave()">
          <use xlink:href="#icon-shu1"></use>
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
          <div class="chat-header-title">
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
          <div class="chat-content-chat">
            <n-scrollbar style="max-height: 100%" ref="virtualListInst">
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
          <div class="chat-footer-bottom">
            <n-input v-model:value="inputMsg" style="width: 300px;" round placeholder="请输入聊天内容" clearable
              @keydown.enter="sendMsgAll()" />
            <n-button round @click="sendMsgAll()">
              发送
            </n-button>
          </div>
        </template>
      </n-drawer-content>
    </n-drawer>
    <!--留言板-->
    <n-drawer v-model:show="leaveShow" :width="500" placement="left">
      <n-drawer-content body-content-class="content">
        <template #header>
          <div class="leave-header-title">
            <div>
              留言版
            </div>
            <n-button-group size="small" class="ml-30">
              <n-button type="default" round @click="searchLeave(1)">
                <template #icon>
                  <n-icon>
                    <ChatboxEllipsesOutline />
                  </n-icon>
                </template>
                闲聊
              </n-button>
              <n-button type="default" @click="searchLeave(2)">
                <template #icon>
                  <n-icon>
                    <ChatboxEllipsesOutline />
                  </n-icon>
                </template>
                问题
              </n-button>
              <n-button type="default" round @click="searchLeave(3)">
                <template #icon>
                  <n-icon>
                    <GameControllerOutline />
                  </n-icon>
                </template>
                活动
              </n-button>
            </n-button-group>
          </div>
        </template>
        <template #default>
          <div class="leave-content-chat">
            <n-scrollbar style="max-height: 100%" ref="virtualListInst">
              <div class="leave-box">
                <div class="leave mb-15" v-for="leave, index in leaveListData" :key="index">
                  <div class="leave-left">
                    <n-avatar round size="medium" :src="leave.userAvatar" />
                  </div>
                  <div class="leave-right">
                    <div class="ml-10" style="color: #FB7299;">{{ leave.nickName }}</div>
                    <div class="ml-10 mt-5">{{ leave.leaveMessage }}</div>
                    <div class="ml-10">
                      <n-image v-for="image in leave.leaveImages" width="120" height="120" :src="image" />
                    </div>
                  </div>
                </div>
              </div>
            </n-scrollbar>
          </div>
        </template>
        <template #footer>
          <n-button round @click="openAddLeave()" v-show="userStore.id">
            添加留言
          </n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
    <!-- 新增留言框 -->
    <n-modal v-model:show="addLeaveShow" transform-origin="center">
      <resuse-form ref="formRef" class="formClass" :formData="addLeaveData" :formOption="leaveOption"
        :formItemOption="selectOption" :rules="rules" labelPosition="right" labelWidth="140">
        <template #ImgUpload>
          <ImgUpload v-model="addLeaveData.leaveImages" :max="3"></ImgUpload>
        </template>
        <template #Footer>
          <n-space>
            <n-button secondary round @click="addLeaveShow = false">
              取消
            </n-button>
            <n-button type="info" secondary round @click="addLeaveSubmit">
              提交
            </n-button>
          </n-space>
        </template>
      </resuse-form>
    </n-modal>
  </div>
</template>
<script setup lang="ts">
import useStore from "@/store";
import chatEnum from "@/utils/chatEnum";
import resuseForm from '@/components/reuseForm/index.vue';
import ImgUpload from '@/components/imgUpload/index.vue'
import { ref, onMounted, Component, h, nextTick, watch, reactive } from 'vue';
import {
  NSelect,
  NInput,
  NEllipsis,
  NScrollbar,
  NDrawer,
  NDrawerContent,
  NCard,
  NSpace,
  useMessage,
  NButton,
  NIcon,
  NSwitch,
  NAvatarGroup,
  NTooltip,
  NAvatar,
  NButtonGroup,
  VirtualListInst,
  NModal,
  NImage
} from 'naive-ui';
import { SaveOutline, ChatboxEllipsesOutline, GameControllerOutline } from '@vicons/ionicons5';
import { CustomType } from '@/types';
import { listLeaveTypeEnum, listModeEnum } from '@/api/enum';
import { listCommunity } from '@/api/community';
import { listLeave, addLeave } from '@/api/leave';

//全局仓库
let { globalStore, userStore } = useStore();

//聊天室是否显示
const chartShow = ref(false);

//活动留言框
const leaveShow = ref(false);

//添加留言表单
const addLeaveShow = ref(false);

//表单
const formRef = ref();

//Dom
const virtualListInst = ref<VirtualListInst>();

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

// 查询参数
const queryParams = ref<any>({
  pageNum: 1,
  pageSize: 999,
  leaveType: null
})

//主播入驻表达数据
const addLeaveData = ref<any>({
  leaveType: null,
  leaveMessage: null,
  leaveImages: null,
});

//留言数据列表
const leaveListData = ref<any>({})

//留言表单配置项
const leaveOption = reactive([
  {
    type: "select", selectProps: "leaveType", props: "leaveType", label: "留言类型", placeholder: "请选择留言类型"
  },
  {
    type: "input", inputType: "textarea", props: "leaveMessage", label: "留言消息", placeholder: "请输入留言消息", maxlength: 255
  },
  {
    type: "slot", slotName: "ImgUpload", props: "leaveImages", label: "留言图片"
  },
  {
    type: "slot", slotName: "Footer"
  }
]);

//数据校验
const rules = ref({
  leaveType: {
    required: true,
    trigger: ['blur', '留言类型'],
    message: '请输入留言类型'
  },
  leaveMessage: {
    required: true,
    trigger: ['blur', '留言消息'],
    message: '请输入留言消息'
  }
})

//select配置项
const selectOption = ref<CustomType>({
  //社区列表
  community: [],
  //模式列表
  mode: [],
  //留言类型列表
  leaveType: []
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

//打开发送留言
const openAddLeave = () => {
  addLeaveData.value = {
    leaveType: null,
    leaveMessage: null,
    leaveImages: null,
  }
  addLeaveShow.value = true;
}

//新增留言
const addLeaveSubmit = async () => {
  formRef.value?.ruleFormRef().validate(async (errors: any) => {
    if (!errors) {
      let addLeaveResult: any = await addLeave(addLeaveData.value);
      if (addLeaveResult.code == 200) {
        message.success("留言成功")
        init();
      } else {
        message.error(addLeaveResult.msg)
      }
      addLeaveShow.value = false;
    }
  })
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
  //获取所有留言类型
  let leaveTypeResult: any = await listLeaveTypeEnum();
  selectOption.value.leaveType = Object.entries(leaveTypeResult.data).map(([key, value]) => ({
    value: key,
    label: value
  }));
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

//打开活动留言
const openLeave = () => {
  leaveShow.value = true;
}

//切换留言类型的函数
const searchLeave = (leaveType: number) => {
  queryParams.value.leaveType = leaveType;
  init();
}

//初始化消息
const init = async () => {
  let leaveListResult = await listLeave(queryParams.value);
  leaveListData.value = leaveListResult.data.map((item: any) => {
    let { leaveImages } = item;
    return {
      ...item,
      leaveImages: leaveImages.split(",")
    }
  });
  console.log(leaveListData.value);
}

//监听消息变化 
watch(globalStore.chatHistory, (newValue: any, oldValue: any) => {
  nextTick(() => {
    virtualListInst.value?.scrollTo({ position: 'bottom' })
  })
}, { deep: true })
onMounted(() => {
  optionInit()
  init();
})
</script>
<style lang="scss" scoped>
.chat-header-title {
  display: flex;
  justify-content: center;
  align-items: center;
}

.leave-header-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-content-chat {
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

.leave-content-chat {
  width: 100%;
  height: 100%;
  padding: 10px 20px;

  .leave-box {
    .leave {
      display: flex;

      .leave-left {}

      .leave-right {
        font-size: 13px;
        font-weight: 500;
        color: black;

        div {
          width: 100%;
          display: flex;
        }
      }
    }
  }
}

.chat-footer-bottom {
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