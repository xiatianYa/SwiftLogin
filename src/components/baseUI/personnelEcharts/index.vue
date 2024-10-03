<template>
    <!-- 等级数量 -->
    <ReuseEcharts :option="option" style="width: 100%;height: 100%;" ref="charts" chartsRef="PersonnelRef" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
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
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: []
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [] as string[]
        },
        yAxis: {
            type: 'value'
        },
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
    option.value.xAxis.data = props.chartData.xaxisData;
    //EXG社区
    option.value.series.push({
        color: '#80FFA5',
        name: "EXG社区",
        type: 'line',
        smooth: true,
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0.25,
                        color: '#80FFA5'
                    },
                    {
                        offset: 1,
                        color: '#fff'
                    }
                ]
            }
        },
        emphasis: {
            focus: 'series'
        },
        data: props.chartData.yaxisData[0]
    })
    //UB社区
    option.value.series.push(
        {
            color: '#00DDFF',
            name: "UB社区",
            type: 'line',
            smooth: true,
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0.25,
                            color: '#00DDFF'
                        },
                        {
                            offset: 1,
                            color: '#fff'
                        }
                    ]
                }
            },
            emphasis: {
                focus: 'series'
            },
            data: props.chartData.yaxisData[1]
        })
    //ZED社区
    option.value.series.push({
        color: '#37A2FF',
        name: "ZED社区",
        type: 'line',
        smooth: true,
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0.25,
                        color: '#37A2FF'
                    },
                    {
                        offset: 1,
                        color: '#fff'
                    }
                ]
            }
        },
        emphasis: {
            focus: 'series'
        },
        data: props.chartData.yaxisData[2]
    })
    //FYS社区
    option.value.series.push({
        color: '#FF0087',
        name: "FYS社区",
        type: 'line',
        smooth: true,
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0.25,
                        color: '#FF0087'
                    },
                    {
                        offset: 1,
                        color: '#fff'
                    }
                ]
            }
        },
        emphasis: {
            focus: 'series'
        },
        data: props.chartData.yaxisData[3]
    })
    //93X社区
    option.value.series.push({
        color: '#FFBF00',
        name: "X社区",
        type: 'line',
        smooth: true,
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    {
                        offset: 0.25,
                        color: '#FFBF00'
                    },
                    {
                        offset: 1,
                        color: '#fff'
                    }
                ]
            }
        },
        emphasis: {
            focus: 'series'
        },
        data: props.chartData.yaxisData[4]
    })
    charts.value.drawCharts();
}

// 监听窗口大小变化  
const handleResize = () => {
    if (charts.value) {
        //清空之前的数据
        option.value.legend.data = [];
        option.value.xAxis.data = [];
        option.value.series = [];
        drawCharts();
    }
};

watch(props, () => {
    //清空之前的数据
    option.value.legend.data = [];
    option.value.xAxis.data = [];
    option.value.series = [];
    drawCharts()
}, { deep: true });

onMounted(() => {
    initCharts()
    drawCharts()
    // 添加窗口大小变化监听  
    window.addEventListener('resize', handleResize);
})

onUnmounted(() => {
    // 移除窗口大小变化监听  
    window.removeEventListener('resize', handleResize);
    // 如果需要，可以在这里进行其他清理工作  
});
</script>

<style lang="scss" scoped></style>