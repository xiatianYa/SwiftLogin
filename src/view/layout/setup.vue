<template>
  <div class="setup">
    <svg class="icon pointer" aria-hidden="true" @click="setDialog = true">
      <use xlink:href="#icon-shezhi"></use>
    </svg>
    <!-- 地图订阅 -->
    <n-drawer v-model:show="setDialog" :width="502" placement="right">
      <n-drawer-content title="系统设置">
        <n-card :bordered="false">
          <n-space vertical>
            <n-select class="mb-10" v-model:value="communityId" :options="selectOption.community" placeholder="请选择指定社区"
              clearable />
            <n-select class="mb-10" v-model:value="modeId" :options="selectOption.mode" placeholder="请选择指定模式"
              clearable />
          </n-space>
          <n-space>
            <n-button class="mr-10" strong secondary type="success" :render-icon="renderIcon(SaveOutline)"
              @click="saveSet">
              保存设置
            </n-button>
          </n-space>
        </n-card>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, Component, h, nextTick } from 'vue'
import { NSelect, NDrawer, NDrawerContent, NCard, NSpace, useMessage, NButton, NIcon } from 'naive-ui';
import { SaveOutline } from '@vicons/ionicons5';
import { CustomType } from '@/types';
import { listModeEnum } from '@/api/enum'
import { listCommunity } from '@/api/community'
//消息对象
const message = useMessage();
const communityId = ref<any>(null);
const modeId = ref<any>(null)
const setDialog = ref(false);

//select配置项
const selectOption = ref<CustomType>({
  //社区列表
  community: [],
  //模式列表
  mode: []
})

//注册图标
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) })
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
  message.success("保存成功")
}

onMounted(() => {
  optionInit()
})


</script>
<style lang="scss" scoped>
.setup {
  position: fixed;
  right: 30px;
  bottom: 40px;
  z-index: 99;

  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    font-size: 32px;
    animation: revolve 2s linear infinite;
    cursor: pointer;
  }
}

.setup:hover .setView {
  opacity: 1;
}
</style>