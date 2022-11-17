<template>
  <tbody>
    <template v-for="(row, rowIndex) in dataList" :key="rowIndex">
      <tr
        :class="{
          warning: selectedRows.indexOf(row) !== -1,
          [row.trClass]: row.trClass
        }"
        @click="rowClick(row, rowIndex)"
      >
        <table-td
          v-for="(column, indexTd) in colsNoExtend"
          :key="indexTd"
          :checked="selectedRows.indexOf(row) !== -1"
          :column="column"
          :row="row"
          :index="rowIndex"
          :column-index="indexTd"
          :title="title"
          :toggle="getToggle(rowIndex)"
          :row-col-span="getRowColSpan(rowIndex, indexTd)"
          :rowspan-colspan-list="state.rowspanColspanList"
          @toggle-extend="toggleExtend(rowIndex, row)"
          @cell-click="cellClick"
        />
      </tr>
      <tr
        v-if="getToggle(rowIndex) && colsExtend.length > 0"
        :key="'tr' + rowIndex"
        class="extend"
        :class="{ warning: selectedRows.indexOf(row) !== -1 }"
      >
        <TableTd
          :column="colsExtend[0]"
          :row="row"
          :index="rowIndex"
          :colspan="colsNoExtend.length"
        />
      </tr>
      <template v-if="hasChild">
        <tr
          v-for="(item, index) in row.children"
          v-show="getToggle(rowIndex)"
          :key="'child' + index"
          :class="{ [row.trClass]: row.trClass }"
          class="tr-child"
          @cllick="rowClick(item, index)"
        >
          <TableTd
            v-for="(child, childIndex) in colsNoExtend"
            :key="'childTd' + childIndex"
            :column="child"
            :row="item"
            :index="index"
            :column-index="childIndex"
            :title="title"
            :parent-row="row"
            @cell-click="cellClick"
          />
        </tr>
      </template>
    </template>
  </tbody>
</template>

<script setup>
  import { reactive, inject, computed, ref } from 'vue'
  import TableTd from './TableTd.vue'
  const props = defineProps({
    data:Array,
    rowColSpan:Array,
    hasChild: Boolean,
    lazyLoad: Function,
    extendToggle: Boolean,// 默认展开或收起状态
    title: Boolean,
    selectedRows:Array,
  })
  const emits = defineEmits(['rowClick','cellClick'])
  const getColumns = inject(`GetColumns`)
  const state = reactive({
    toggle: {}, // {1: true, 2: false, 0: false} // 对应每行展开或收起状态
    rowspanColspanList: []
  })
  const dataList = ref(props.data) // 这里要转一下，加载子级时才能同步展示
  const colsExtend = computed(() => {
    return getColumns.value.filter((item) => {
      return item.type === 'extend' && !item.children
    })
  })
  const colsNoExtend = computed(() => {
    // 不带扩展的
    return getColumns.value.filter((item) => {
      return item.type !== 'extend' && !item.children
    })
  })
  const getToggle = (rowIndex) => {
    return state.toggle[rowIndex] === undefined
      ? props.extendToggle
      : state.toggle[rowIndex]
  }
  // 展开或收起扩展行
  const toggleExtend = (index, row) => {
    // 存在扩展时或有子级时
    if (colsExtend.value.length > 0 || props.hasChild) {
      if (typeof state.toggle[index] === 'undefined') {
        state.toggle[index] = !props.extendToggle
      } else {
        state.toggle[index] = !state.toggle[index]
      }
      // 展开时，如果是懒加载
      console.log(state.toggle[index])
      if (state.toggle[index] && props.lazyLoad) {
        props.lazyLoad(row, (child) => {
          if (child && child.length > 0) {
            row.children = child
          }
        })
      }
    }
  }
  const rowClick = (row, index) => {
    emits('rowClick', row, index)
  }
  const cellClick = (
    row,
    column,
    rowIndex,
    columnIndex
  ) => {
    emits('cellClick', row, column, rowIndex, columnIndex)
  }
  // 处理合并数理
  const formatRowColSpan = computed(() => {
    const temp = []
    if (props.rowColSpan && props.rowColSpan.length > 0) {
      props.rowColSpan.forEach((item) => {
        temp.push(item)
        if (item.colSpan && item.colSpan > 1) {
          // 计算不需要显示的列
          for (let i = 1; i < item.colSpan; i++) {
            temp.push({
              row: item.row,
              col: item.col + i,
              colSpan: 0
            })
          }
        }
        // 计算不需要显示的行
        if (item.rowSpan && item.rowSpan > 1) {
          for (let i = 1; i < item.rowSpan; i++) {
            temp.push({
              row: item.row + i,
              col: item.col,
              rowSpan: 0
            })
          }
        }
      })
    }
    return temp
  })
  const getRowColSpan = (row, col) => {
    const newRow = formatRowColSpan.value.filter((item) => {
      return item.row === row && col === item.col
    })
    if (newRow.length > 0) {
      return newRow[0]
    } else {
      return []
    }
  }
</script>