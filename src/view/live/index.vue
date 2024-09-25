<template>
    <div class="livePage p-20">
        <!-- 标题 -->
        <div class="d_flex_ac d_flex_sb mb-20">
            <n-space style="align-items: center;" justify="space-between" @click="openJoin">
                <div class="title">直播推荐</div>
                <n-button class="ml-20" strong secondary type="success" size="small"
                    :render-icon="renderIcon(PersonAddOutline)" v-show="userStore.id">
                    主播入驻
                </n-button>
            </n-space>
        </div>
        <!-- 主体 -->
        <n-spin :show="loading" :size="'large'" style="min-height: 50vh;">
            <div class="lives">
                <n-card class="live mb-10" content-style="padding: 0;" v-for="live in liveData" :key="live.id"
                    @click="goHref(live.liveUrl)">
                    <div class="image-container" @mouseover="showStatusId = live.roomId"
                        @mouseleave="showStatusId = null">
                        <n-image width="100%" height="100%" :src="live.bgUrl" :preview-disabled="true" />
                        <div class="overlay"
                            :style="showStatusId != live.roomId && live.online ? 'display: none;' : ''"></div>
                        <div class="status">
                            <span v-if="showStatusId == live.roomId && live.online">
                                进入直播间
                            </span>
                            <span v-if="!live.online">
                                未开播
                            </span>
                        </div>
                        <div class="gameType">
                            <span>
                                {{ live.parentAreaName }}
                            </span>
                        </div>
                    </div>

                    <div class="p-10 d_flex">
                        <div class="d_flex_ac">
                            <n-avatar round size="medium" :src="live.avatarUrl" />
                        </div>
                        <div style="width: 100%;" class="ml-10">
                            <n-ellipsis :line-clamp="1">
                                {{ live.title }}
                            </n-ellipsis>

                            <div class="d_flex d_flex_sb">
                                <n-ellipsis style="max-width: 120px">
                                    {{ live.uname }}
                                </n-ellipsis>
                                <span class="d_flex">
                                    <n-icon size="20" class="mr-5">
                                        <EyeOutline />
                                    </n-icon>
                                    {{ live.online }}
                                </span>
                            </div>
                        </div>
                    </div>
                </n-card>
            </div>
        </n-spin>
        <!-- 主播入驻申请框 -->
        <n-modal v-model:show="joinShow" transform-origin="center">
            <resuse-form ref="formRef" class="formClass" :formData="joinData" :rules="rules" :formOption="formOption"
                labelPosition="right" labelWidth="140">
                <template #Footer>
                    <n-space>
                        <n-button secondary round @click="joinShow = false">
                            取消
                        </n-button>
                        <n-button type="info" secondary round @click="joinSubmit">
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
import resuseForm from '@/components/reuseForm/index.vue'
import { ref, h, Component, onMounted, reactive } from 'vue';
import { addLive, listLive } from '@/api/live';
import { NImage, NSpace, NAvatar, NIcon, NSpin, NEllipsis, NCard, NButton, NModal, useMessage } from 'naive-ui';
import { PersonAddOutline } from '@vicons/ionicons5';
import { EyeOutline } from '@vicons/ionicons5'

//全局仓库
let { userStore } = useStore();

//消息对象
const message = useMessage();

//表单
const formRef = ref();

//数据列表
const liveData = ref<any>({});

//是否在加载
const loading = ref(false);

//是否显示进入直播间
const showStatusId = ref(null);

//主播入驻框是否显示
const joinShow = ref(false);

//主播入驻表达数据
const joinData = ref<any>({});

//表单配置项
const formOption = reactive([
    {
        type: "input", props: "uid", label: "直播间uid", placeholder: "请输入直播间uid"
    },
    {
        type: "slot", slotName: "Footer"
    }
]);

const rules = ref({
    uid: {
        required: true,
        trigger: ['blur', '直播间uid'],
        message: '请输入直播间uid'
    }
})

//配置项初始化
const optionInit = async () => {
}

//注册图标
const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
}

//打开主播入驻
const openJoin = () => {
    joinShow.value = true;
    joinData.value = {};
}

//数据初始化
const init = async () => {
    let liveResult: any = await listLive();
    liveData.value = liveResult.data;
    loading.value = false;
}

//新增主播入驻
const joinSubmit = () => {
    formRef.value?.ruleFormRef().validate(async (errors: any) => {
        if (!errors) {
            let liveResult: any = await addLive(joinData.value);
            if (liveResult.code == 200) {
                message.success("入驻成功")
                init();
            } else {
                message.error(liveResult.msg)
            }
            joinShow.value = false;
        }
    })
}

//前往直播间
const goHref = (url: string) => {
    window.open(url, '_blank');
}

onMounted(() => {
    loading.value = true;
    optionInit()
    init()
})
</script>

<style scoped lang="scss">
.livePage {
    height: auto;

    .title {
        font-size: 16px;
        font-weight: bolder
    }

    .lives {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: auto;

        .live {
            width: 23%;
            height: auto;
            margin-right: 1%;
            cursor: pointer;

            .image-container {
                width: 100%;
                position: relative;

                .overlay {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(black, 0.6);
                    top: 0;
                }

                .status {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    top: 0;
                    font-weight: bold;
                    color: #fff;
                }

                .gameType {
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    color: black;
                    font-weight: bold;
                }
            }
        }
    }
}
</style>