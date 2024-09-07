<template>
    <!-- 等级数量 -->
    <ReuseEcharts :option="option" style="width: 100%;height: 100%;" ref="charts" />
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
    if (!chartData.value) {
        return;
    }
    option.value.legend.data = chartData.value.communityNameList;
    option.value.xAxis[0].data = chartData.value.xaxisData;
    for (let index = 0; index < chartData.value.yaxisData.length; index++) {
        const xData = chartData.value.yaxisData[index];
        option.value.series.push({
            name: chartData.value.communityNameList[index],
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
                width: 0
            },
            showSymbol: false,
            label: {
                show: true,
                position: 'top'
            },
            areaStyle: {
                opacity: 1,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                    {
                        offset: 0,
                        color: getRandomColor(index, 0)
                    },
                    {
                        offset: 1,
                        color: getRandomColor(index, 1)
                    }
                ])
            },
            emphasis: {
                focus: 'series'
            },
            data: xData
        })
    }
    charts.value.drawCharts();
}

const getRandomColor = (index: number, lineIndex: number) => {
    let colorList01 = ['rgb(128, 255, 165)', 'rgb(0, 221, 255)', 'rgb(55, 162, 255)', 'rgb(255, 0, 135)', 'rgb(255, 191, 0)']
    let colorList02 = ['rgb(1, 191, 236)', 'rgb(77, 119, 255)', 'rgb(116, 21, 219)', 'rgb(135, 0, 157)', 'rgb(224, 62, 76)']
    if (lineIndex) {
        return colorList01[index]
    } else {
        return colorList02[index]
    }
}

watch(chartData, () => {
    //清空之前的数据
    option.value.legend.data = [];
    option.value.xAxis[0].data = [];
    option.value.series = [];
    drawCharts()
});

onMounted(() => {
    initCharts()
    drawCharts()
})
</script>

<style lang="scss" scoped></style>