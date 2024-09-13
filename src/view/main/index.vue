<template>
    <div class="mainPage p-20">
        <div class="main-left mr-10">
            <n-card class="echarts mb-10">
                <personnelEcharts :chartData="personnelData"></personnelEcharts>
            </n-card>
            <n-card class="timeline mb-10">
                <n-space>
                    <span style="font-size: 16px;font-weight: bold;">
                        项目动态
                    </span>
                </n-space>
                <n-timeline class="mt-10">
                    <n-timeline-item type="success" content="新增地图订阅 新增亮度模式切换 v0.0.1" time="2024-08-11" />
                    <n-timeline-item type="success" content="新增全局设置 修改配置项搜索服务器 v0.0.2" time="2024-08-12" />
                    <n-timeline-item type="success" content="新增绑键助手 v0.0.3" time="2024-08-12" />
                    <n-timeline-item type="success" content="新增地图列表 v0.0.4" time="2024-08-24" />
                    <n-timeline-item type="success" content="新增地图订阅通知 v0.0.4" time="2024-08-29" />
                    <n-timeline-item type="success" content="优化代码,新增挤服/挂机数据图片显示,新增地图订阅图片显示 v0.0.5" time="2024-08-29" />
                    <n-timeline-item type="success" content="优化代码,优化服务器查询效率,优化挤服机制 v0.0.6" time="2024-09-01" />
                    <n-timeline-item type="success" content="新增用户登录,新增聊天室 v0.0.7" time="2024-09-04" />
                    <n-timeline-item type="success" content="删除挂机模式(防止恶意挂机) v0.0.8" time="2024-09-05" />
                    <n-timeline-item type="success" content="优化地图订阅,实现多图,社区勾选,优化聊天室功能 v0.0.9" time="2024-09-06" />
                    <n-timeline-item type="success" content="新增首页模块,数据可视化屏幕 v0.1.0" time="2024-09-07" />
                    <n-timeline-item type="success" content="修改前同事的狗屎代码组件,我就不应该用你的组件,我测测测死你的🐎 v0.1.1"
                        time="2024-09-07" />
                    <n-timeline-item type="success" content="优化地图订阅,可删除订阅地图,浏览器刷新后之前订阅的地图不会删除 v0.1.2"
                        time="2024-09-10" />
                    <n-timeline-item type="success" content="新增直播推荐(大主播入驻请加反馈群),修复自动挤服Bug(特性) v0.1.3"
                        time="2024-09-12" />
                    <n-timeline-item content="新增订图公告(各位大佬订图可在这里添加) v0.1.4" time="待定" line-type="dashed" />
                    <n-timeline-item content="新增留言版(保留三天) v0.1.5" time="待定" line-type="dashed" />
                    <n-timeline-item content="新增登录器软件,无需浏览器版本 v0.1.6" time="待定" line-type="dashed" />
                </n-timeline>
            </n-card>
        </div>
        <div class="main-right ml-10">
            <n-card class="echarts mb-10">
                <personnelCake :chartData="personnelCakeData"></personnelCake>
            </n-card>
            <n-card class="echarts mb-10">
                <n-result status="404" title="让我想想这里应该放啥呢?" description="生活总归带点荒谬">
                    <template #footer>
                        <n-button></n-button>
                    </template>
                </n-result>
            </n-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import personnelEcharts from "@/components/baseUI/personnelEcharts/index.vue";
import personnelCake from "@/components/baseUI/personnelCake/index.vue";
import useStore from "@/store";
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { statisticsEchats } from '@/api/statistics';
import { NTimeline, NTimelineItem, NCard, NSpace, NResult } from 'naive-ui';
let { globalStore } = useStore();

const personnelData = ref([])
const personnelCakeData = ref<any>([])
const personnelTimer = ref()
const init = async () => {
    let statisticsResult: any = await statisticsEchats();
    personnelData.value = statisticsResult.data;
    personnelTimer.value = setInterval(async () => {
        let statisticsResult: any = await statisticsEchats();
        personnelData.value = statisticsResult.data;
    }, 10000)
}

watch(() => globalStore.serverInfo, async (newValue: any, oldValue: any) => {
    if (!newValue) {
        return;
    }
    personnelCakeData.value = [];
    globalStore.serverInfo.forEach((value: any, key: any) => {
        let countPersonnel = 0;
        let responsePromise = JSON.parse(value)
        responsePromise.map((item: any) => {
            //获取服务器信息
            let serverInfo = item.response.servers
            if (!serverInfo) return;
            //获取在线人数
            let { players } = serverInfo[0]
            countPersonnel += players;
        })
        personnelCakeData.value.push(countPersonnel);
    })
}, { deep: true })
onUnmounted(() => {
    clearInterval(personnelTimer.value);
})
onMounted(() => {
    init();
})
</script>

<style scoped lang="scss">
.mainPage {
    display: flex;
    width: 100%;
    height: 100%;

    .main-left {
        width: 50%;

        .echarts {
            width: 100%;
            height: 50%;
            border-radius: 5px;
        }

        .timeline {
            width: 100%;
            border-radius: 5px;
        }
    }

    .main-right {
        width: 50%;

        .echarts {
            width: 100%;
            height: 50%;
            border-radius: 5px;
        }
    }
}
</style>