<template>
    <!-- 等级数量 -->
    <ReuseEcharts :option="option" style="height: 100%;" ref="charts" chartsRef="PersonnelCakeRef" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch, defineProps } from 'vue';
import ReuseEcharts from '@/components/reuseEcharts/index.vue';

// 定义 props 类型  
type Props = {
    chartData: any; // 这里假设 myProp 是一个字符串  
};

// 使用 defineProps 接收 props  
const props = defineProps<Props>();

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
    if (!props.chartData) {
        return;
    }
    if (props.chartData.length == 0) {
        return;
    }
    for (let index = 0; index < props.chartData.length; index++) {
        const seriesData = props.chartData[index];
        option.value.series[0].data[index].value = seriesData;
    }
    charts.value.drawCharts();
}


watch(props, () => {
    drawCharts()
}, { deep: true });

onMounted(() => {
    initCharts()
    drawCharts()
})
</script>

<style lang="scss" scoped></style>