<template>
    <n-flex>
        <n-card :title="card.label" v-for="card, index in cardDataVo" :key="index" v-show="card.data.length">
            <n-flex :wrap="true" :title="card.label">
                <div class="server-box" v-for="server in card.data">
                    <!-- 服务器人数颜色条 -->
                    <div class="server-online" :style="`${getOnLineColor(server)}`">
                    </div>
                    <img class="server-img"
                        :src="server.mapUrl ? server.mapUrl : 'https://bluearchive.top/statics/2024/09/26/imgError.jpg'">
                    <!-- 服务器信息 -->
                    <div class="server-info" :style="server.map == '获取失败!' ? 'color: #ff0000;' : ''">
                        <n-space style="font-size: 16px;">
                            {{ server.name }}
                        </n-space>
                        <n-space>
                            <n-icon size="24">
                                <GameControllerOutline />
                            </n-icon>
                            {{ server.players + '/' + server.maxPlayers }} | {{ server.mapName }}
                        </n-space>
                    </div>
                    <!-- 服务器操作 -->
                    <div class="server-options">
                        <n-space :vertical="true">
                            <n-button-group vertical>
                                <n-button size="medium" round ghost @click="props.onPlay(server)">
                                    <template #icon>
                                        <n-icon size="24px" color="#fff">
                                            <EnterOutline />
                                        </n-icon>
                                    </template>
                                </n-button>
                                <n-button size="medium" ghost @click="props.onCopy(server)">
                                    <template #icon>
                                        <n-icon size="24px" color="#fff">
                                            <CopyOutline />
                                        </n-icon>
                                    </template>
                                </n-button>
                                <n-button size="medium" round ghost @click="props.onAutomatic(server)">
                                    <template #icon>
                                        <n-icon size="24px" color="#fff">
                                            <AlarmOutline />
                                        </n-icon>
                                    </template>
                                </n-button>
                            </n-button-group>
                        </n-space>
                    </div>
                </div>
            </n-flex>
        </n-card>
    </n-flex>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { NFlex, NSpace, NCard, NIcon, NButton, NButtonGroup } from 'naive-ui';
import { type CustomType } from '@/types';
import { GameControllerOutline, EnterOutline, CopyOutline, AlarmOutline } from '@vicons/ionicons5';

interface Props {
    // 卡片数据
    cardData: CustomType;
    // 模式数据
    modeData: CustomType;
    // 连接服务器函数
    onPlay?: any;
    // 复制服务器连接命令函数
    onCopy?: any;
    // 自动挤服函数
    onAutomatic?: any;
}
// props参数
let props = withDefaults(defineProps<Props>(), {
    cardData: () => { return [] },
    modeData: () => { return [] },
    onPlay: () => { },
    onCopy: () => { },
    onAutomatic: () => { }
})

//整合后的卡片数据
const cardDataVo = ref<any>([])

//计算进度颜色
const getOnLineColor = (server: any) => {
    if (server.map == '获取失败') return;
    if (server.players <= 30) {
        return `background-color: #2fef10;width: ${(server.players / server.maxPlayers) * 100}%;`;
    } else if (server.players <= 50) {
        return `background-color: #a9f604;width: ${(server.players / server.maxPlayers) * 100}%;`;
    } else if (server.players <= 80) {
        return `background-color: #ff4f00;width: ${(server.players / server.maxPlayers) * 100}%;`;
    } else {
        return `background-color: #ff0000;width: ${(server.players / server.maxPlayers) * 100}%;`;
    }
}

onMounted(() => {
    console.log(props.cardData, props.modeData);
})
watch(() => props.cardData, (newValue: any, oldValue: any) => {
    cardDataVo.value = props.modeData.map((item: any) => {
        let { value, label } = item;
        //查询出该模式下的服务器数据
        let resultData = newValue.filter((server: any) => item.value == server.modeId);
        return {
            value: value,
            label: label,
            data: resultData
        }
    })
})
</script>
<style scoped lang="scss">
.server-box {
    /* 默认情况下，每个子元素占据一行 */
    width: 24%;
    min-width: 320px;
    position: relative;

    :only-child {
        width: 100%;
        min-width: 100%;
    }

    .server-img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        object-position: center;
        border-radius: 5px;
    }

    .server-info {
        position: absolute;
        top: 20px;
        left: 10px;
        font-weight: bold;
        color: #fff;
    }

    .server-options {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 100%;
        position: absolute;
        top: 0px;
        right: 5px;
    }

    .server-online {
        position: absolute;
        width: 100%;
        /* 绝对定位 */
        top: 0;
        /* 顶部对齐 */
        left: 0;
        /* 左侧对齐 */
        right: 0;
        /* 右侧对齐 */
        height: 5px;
        /* 色条背景色 */
        border-top-left-radius: 5px;
        /* 左上角圆角 */
        border-top-right-radius: 5px;
        /* 右上角圆角 */
    }
}

@media (max-width: 800px) {
    .server-box {
        /* 默认情况下，每个子元素占据一行 */
        width: 100%;
        min-width: none;
    }
}
</style>