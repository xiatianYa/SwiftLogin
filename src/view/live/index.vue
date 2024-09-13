<template>
    <div class="livePage p-20">
        <!-- 标题 -->
        <div class="d_flex_ac d_flex_sb mb-20">
            <div class="title">直播推荐</div>
        </div>
        <!-- 主体 -->
        <n-spin :show="loading" :size="'large'" style="min-height: 50vh;">
            <div class="lives">
                <n-card class="live mb-10" content-style="padding: 0;" v-for="live in liveData"
                    @click="goHref(live.liveUrl)">
                    <div class="image-container" @mouseover="showStatusId = live.roomId"
                        @mouseleave="showStatusId = null">
                        <n-image width="100%" height="100%" :src="'data:image/jpeg;base64,' + live.coverByte"
                            :preview-disabled="true" />
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
                            <n-avatar round size="medium" :src="'data:image/jpeg;base64,' + live.userCoverByte" />
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
    </div>
</template>

<script setup lang="ts">
import { ref, h, Component, onMounted } from 'vue';
import { listLive } from '@/api/live';
import { NImage, NSpace, NAvatar, NIcon, NSpin, NEllipsis, NCard } from 'naive-ui';
import { EyeOutline } from '@vicons/ionicons5'

//数据列表
const liveData = ref<any>([])

//是否在加载
const loading = ref(false);

//是否显示进入直播间
const showStatusId = ref(null);

//配置项初始化
const optionInit = async () => {
}
//数据初始化
const init = async () => {
    let liveResult: any = await listLive();
    liveData.value = liveResult.data;
    loading.value = false;
    console.log(liveData.value);
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