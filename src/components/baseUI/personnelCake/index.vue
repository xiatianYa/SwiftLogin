<template>
    <!-- 等级数量 -->
    <ReuseEcharts :option="option" style="height: 100%;" ref="charts" chartsRef="PersonnelCakeRef" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch, defineProps, onUnmounted } from 'vue';
import ReuseEcharts from '@/components/reuseEcharts/index.vue';

// 定义 props 类型  
type Props = {
    chartData: any; // 这里假设 myProp 是一个字符串  
};

// 使用 defineProps 接收 props  
const props = defineProps<Props>();

//饼图轮播
const timer = ref<any>(null);

//当前轮播下标
const currentIndex = ref(-1);

//图表对象
const myChart = ref()

const charts = ref();

let option = ref<any>(
    {
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
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
                    position: 'center',
                    formatter: function (params: any) {
                        return params.name + '(' + params.value + ")";
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold',
                        fontFamily: '阿里妈妈方圆体 VF Regular'
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

// 定时轮播
const timingFn = () => {
    timer.value = setInterval(function () {
        var dataLength = option.value.series[0].data.length;
        // 取消之前高亮的图形
        myChart.value.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: currentIndex.value
        });
        // 取消之前的选择
        myChart.value.dispatchAction({
            type: 'unselect',
            seriesIndex: 0,
            dataIndex: currentIndex.value
        });
        currentIndex.value = (currentIndex.value + 1) % dataLength;
        // 高亮当前图形
        myChart.value.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: currentIndex.value
        });
        // 选择指定的数据
        myChart.value.dispatchAction({
            type: 'toggleSelect',
            seriesIndex: 0,
            dataIndex: currentIndex.value
        });
        // 显示 tooltip
        myChart.value.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: currentIndex.value
        });
    }, 3000);
}

// echarts事件
const echartsEvent = () => {
    myChart.value.on('mouseover', (params: any) => {
        clearInterval(timer.value);
        // 取消之前高亮的图形
        myChart.value.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: currentIndex.value
        });
        // 取消之前的选择
        myChart.value.dispatchAction({
            type: 'unselect',
            seriesIndex: 0,
            dataIndex: currentIndex.value
        });
        // 高亮当前图形
        currentIndex.value = params.dataIndex
        myChart.value.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: currentIndex.value
        });
        myChart.value.dispatchAction({
            type: 'toggleSelect',
            seriesIndex: 0,
            dataIndex: currentIndex.value
        });
    });
    myChart.value.on('mouseout', (params: any) => {
        currentIndex.value = params.dataIndex
        timingFn()
    });
}

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
    drawCharts()
}, { deep: true });

onMounted(() => {
    initCharts()
    myChart.value = charts.value?.myChart;
    timingFn()
    echartsEvent()
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