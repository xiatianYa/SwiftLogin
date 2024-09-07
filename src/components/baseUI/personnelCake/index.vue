<template>
    <!-- 等级数量 -->
    <ReuseEcharts :option="option" style="height: 100%;" ref="charts" />
</template>
<script setup lang="ts">
import { ref, toRefs, onMounted, watch } from 'vue';
import * as echarts from "echarts";
import ReuseEcharts from '@/components/reuseEcharts/index.vue';

interface Props {
    chartData: any,
}

let props = withDefaults(defineProps<Props>(), {
    chartData: () => {
        return null;
    },
})

let { chartData } = toRefs(props);

const charts = ref();

let option = ref<any>(
    {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: 13,
            left: 'center',
            textStyle: { // 设置图例文字样式  
                color: '#5b5c63' // 设置为白色  
            }
        },
        series: [
            {
                name: '在线玩家',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                padAngle: 5,
                itemStyle: {
                    borderRadius: 10
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 0, name: 'EXG社区' },
                    { value: 0, name: 'UB社区' },
                    { value: 0, name: 'ZED社区' },
                    { value: 0, name: 'FYS社区' },
                    { value: 0, name: 'X社区' }
                ]
            }
        ]
    }
);

const initCharts = () => {
    charts.value.initCharts();
};

const drawCharts = () => {
    if (!chartData.value) {
        return;
    }
    for (let index = 0; index < chartData.value.length; index++) {
        const seriesData = chartData.value[index];
        option.value.series[0].data[index].value = seriesData;
    }
    charts.value.drawCharts();
}


watch(chartData, () => {
    drawCharts()
});

onMounted(() => {
    initCharts()
    drawCharts()
})
</script>

<style lang="scss" scoped></style>