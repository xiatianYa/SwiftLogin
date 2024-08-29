<template>
    <n-data-table :columns="tableColumns" :data="tableData" :pagination="pagination" :bordered="true"
        :row-class-name="rowClassName" />
</template>
<script lang="ts" setup>
import { NDataTable } from 'naive-ui'
interface Props {
    // 表格字段
    tableColumns?: any[],
    // 表格数据
    tableData?: any[],
    //分页
    pagination?: any,
    //自定义样式
    rowClassName?: Function,
}
const props = withDefaults(defineProps<Props>(), {
    tableColumns: () => [],
    tableData: () => [],
    pagination: () => false,
})
</script>
<style lang="scss" scoped></style>