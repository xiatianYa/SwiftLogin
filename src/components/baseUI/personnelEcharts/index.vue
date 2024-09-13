<template>
    <!-- 等级数量 -->
    <ReuseEcharts :option="option" style="width: 100%;height: 100%;" ref="charts" chartsRef="PersonnelRef" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as echarts from "echarts";
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
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        title: {
            text: '各社区玩家在线数',
            textStyle: { // 设置标题文字样式  
                color: '#5b5c63' // 设置为白色  
            },
            top: 10,
            left: 10,
        },
        grid: {
            containLabel: true,
            left: 20,
            top: 80,
            right: 20,
            bottom: 10
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#5b5c63'
                }
            }
        },
        legend: {
            top: 13,
            right: 10,
            data: [],
            textStyle: { // 设置图例文字样式  
                color: '#5b5c63' // 设置为白色  
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: [],
                axisLabel: {
                    textStyle: { // 设置坐标轴标签文字样式  
                        color: '#5b5c63' // 设置为白色  
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: []
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
    option.value.legend.data = props.chartData.communityNameList;
    option.value.xAxis[0].data = props.chartData.xaxisData;
    for (let index = 0; index < props.chartData.yaxisData.length; index++) {
        const xData = props.chartData.yaxisData[index];
        option.value.series.push({
            name: props.chartData.communityNameList[index],
            type: 'line',
            emphasis: {
                focus: 'series'
            },
            data: xData
        })
    }
    charts.value.drawCharts();
}

watch(props, () => {
    //清空之前的数据
    option.value.legend.data = [];
    option.value.xAxis[0].data = [];
    option.value.series = [];
    drawCharts()
}, { deep: true });

onMounted(() => {
    initCharts()
    drawCharts()
})
</script>

<style lang="scss" scoped></style>