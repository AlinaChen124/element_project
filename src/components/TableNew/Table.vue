<template>
  <div>
    <div
      ref="el"
      :class="{
        ['table']: true,
        [className]: className,
        'is-scroll': width || height
      }"
      :style="{
        width: width,
        height: state.stateHeight,
        overflowY: height ? 'auto' : '',
        overflowX: width ? 'auto' : ''
      }"
    >
      <table
        ref="tableEl"
        :class="{
          'no-stripe': !stripe,
          'no-border': !border,
          'no-hover': !hover,
          'no-ellipsis': !ellipsis,
          [className]: className
        }"
      >
        <colgroup>
          <col
            v-for="(col, index) in state.colWidth"
            :key="index"
            :width="col"
            :class="`column${index}`"
          />
        </colgroup>
        <table-head
          ref="tableHeadEl"
          :drag="drag"
          :title="title"
          :sort-single="sortSingle"
          :show-header="showHeader"
          :select-checked="selectChecked"
          :head-max-layer="state.headMaxLayer"
          @event="tableHeadEvent"
        />
        <tbody v-if="tableData.length === 0">
          <tr>
            <td :colspan="columnsData.length" class="empty">
              {{ emptyText }}
            </td>
          </tr>
        </tbody>
        <table-body
          v-else
          :data="tableData"
          :row-col-span="rowColSpan"
          :has-child="hasChild"
          :lazy-load="lazyLoad"
          :extend-toggle="extendToggle"
          :title="title"
          :selected-rows="state.selectedRows"
          @row-click="rowClick"
          @cell-click="cellClick"
        />
      </table>
      <div
        v-if="dragLine && drag && state.dragHead.mouseDown"
        class="table-drag-line"
      ></div>
    </div>
    <div class="table-page-space" v-if="Object.keys(pagination).length"></div>
    <Pagination
      v-if="Object.keys(pagination).length > 0"
      :total="tableData && tableData.length"
      v-bind="pagination"
    />
  </div>
</template>

<script setup>
  // import { Pagination } from '../pagination'
  import TableHead from './TableHeader.vue'
  import TableBody from './TableBody.vue'
  import {
    reactive,
    provide,
    onMounted,
    computed,
    onUnmounted,
    nextTick,
    ref,
    watch,
    useSlots
  } from 'vue'
  import { getOffset } from '../../hooks/util'
  const slots = useSlots()
  const props = defineProps({
    tableData:{
      type:Array,
      default:()=>{return []}
    },
    height:String,//table的高，溢出显示滚动条，并表头固定
    width:String,
    className:{
      type:String,
      default:''
    },
    hover:{//鼠标悬停时高亮
      type:Boolean,
      default:true
    },
    border:{// 表格纵向边框
      type:Boolean,
      default:false
    },
    stripe:{//是否显示间隔斑马纹
      type:Boolean,
      default:true
    },
    ellipsis:{// 表格单元格文字溢出显示…，在不指定列宽时，各列平分表格宽
      type:Boolean,
      default:true
    },
    showHeader:{// 是否显示表头
      type:Boolean,
      default:true
    },
    drag:{// 允许拖动表头改变当前单元格宽度
      type:Boolean,
      default:true
    },
    dragLine:{// 拖动时显示垂直线
      type:Boolean,
      default:true
    },
    dragWidth:{ // 允许拖动的最大与最小宽度,0为不限制
      type:Array,
      default:[60,0]
    },
    title:{// 鼠标滑过单元格时显示title提示
      type:Boolean,
      default:true
    },
    emptyText:{// data为空的时候显示
      type:String,
      default:'暂无数据'
    },
    rowColSpan:{
      // 合并行或列方法。通过给传入 rowColSpan 方法可以实现合并行或列，
      // 方法的参数(当前行号 rowIndex,当前列号 columnIndex,当前行 row,当前列 column)四个属性。
      // 该函数返回一个包含两个数字的数组，第一个 rowspan，第二个 colspan，即向纵向和横向合并多少个单元格
      type:Array,
    },
    hasChild:Boolean,//是否包含子节点数据，为true时，当 row 中包含 children 字段时，被视为子节点数据
    lazyLoad:Function,
    extendToggle:Boolean,// 默认展开扩展
    sortSingle:Boolean,// 单个排序
    columns:{// 表头数据
      type:Array
    },
    pagination:{
      type:Object,
      default:()=>{}
    },
    fixedBottomScroll:Boolean|String
  })
  const emits = defineEmits(['selectClick','sortChange','rowClick','cellClick','dragChange','scroll'])
  const el = ref()
  const tableEl = ref()
  const tableHeadEl = ref()
  const columnsData = ref([])
  const state = reactive({
    colWidth: [],
    selectedRows: [], // 已选择的行
    dragHead: {}, // 临时存放表头拖动信息
    ctrlIsDown: false, // 是否按下ctrl键
    ctrlRowIndex: -1, // 按下ctrl键盘时点击的checkbox序号
    isSetThWidth: false, // 用于记录是否已经重新设置过表头的实际宽
    headMaxLayer: 1, // 表头的层级
    stateHeight: props.height
  })
  // 预防中途有修改高的时候
  watch(
    () => props.height,
    (val) => {
      state.stateHeight = val
    }
  )
  //provide(`${prefixCls}ColumnsType`, !!props.columns) // column组件用来判断添加表头数据
  const selectChecked = computed(() => {
    // 表头checkbox勾选状态0全不选，1全选，2半选
    const len = state.selectedRows.length
    if (len === 0) {
      return 0 // 全不选
    } else if (len === props.data.length) {
      return 1 // 全选
    } else {
      return 2
    }
  })
  // 对外提供的方法，用于多选或取消表格行
  const toggleRowSelection = (row, selected = true) => {
    // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）row, selected
    const index = state.selectedRows.indexOf(row)
    if (!selected) {
      // 取消勾选当前行
      if (index !== -1) {
        state.selectedRows.splice(index, 1)
      }
    } else {
      // 勾选当前行，没有时添加。有时不重复添加
      if (index === -1) {
        state.selectedRows.push(row)
      }
    }
  }
  watch(
    () => props.columns,
    () => {
      columnsData.value = []
      formatColumns()
    }
  )
  const formatColumns = () => {
    getColumns(props.columns, 0, '')
    columnsData.value.forEach((item) => {
      // console.log(item)
      if (!item.children) {
        // 没有子级时，计算纵向合并
        const rowspan = state.headMaxLayer - item._layer + 1 // 纵向合并
        if (rowspan > 1) {
          item._rowspan = rowspan
        }
      } else {
        // 计算横向合并
        const colspan = columnsData.value.filter((col) => {
          const prop = col._tProps?.split(',')
          return prop && prop.includes(item.prop) && !col.children
        })
        if (colspan?.length > 0) {
          item._colspan = colspan.length
        }
      }
    })
  }
  // 使用columns传参时
  const getColumns = (data, layer = 0, tProps = '') => {
    layer++
    if (state.headMaxLayer < layer) {
      state.headMaxLayer = layer
    }
    // 使用传参形式
    // 有slots时，将slots添加到columns里
    data.forEach((item) => {
      const prop = item.prop || ''
      const newTProps = tProps ? tProps + ',' + prop : prop
      if (item.children) {
        // 有多级表头
        getColumns(item.children, layer, newTProps)
      } else {
        // 有具名插槽时
        if (Object.keys(slots).length) {
          for (let key in slots) {
            if (item.prop === key) {
              if (!item.slots) {
                item.slots = {}
              }
              Object.assign(item.slots, { default: slots[key] })
            }
            if (item.prop + '-header' === key) {
              if (!item.slots) {
                item.slots = {}
              }
              Object.assign(item.slots, { header: slots[key] })
            }
          }
        }
      }
      columnsData.value.push({
        ...item,
        _layer: layer,
        _tProps: newTProps
      })
    })
  }
  // 表头使用参数形式
  if (props.columns) {
    formatColumns()
  }
  provide(`GetColumns`, columnsData) // columns.value的形式不是双向的
  provide(
    `SetSelectedRows`,
    (bool, row, index) => {
      // 由单元格勾选时触发，添加或删除
      const indexOf = state.selectedRows.indexOf(row)
      if (bool && indexOf === -1) {
        state.selectedRows.push(row)
      } else {
        state.selectedRows.splice(indexOf, 1)
      }
      if (state.ctrlIsDown) {
        // ctrl键盘当前为按下状态
        if (state.ctrlRowIndex !== -1) {
          // 不为空，表示已经点击了第一个。此时将上一次保存的即ctrlRowIndex和index之间的记录勾上或取消
          let start = state.ctrlRowIndex
          let end = index
          if (state.ctrlRowIndex > index) {
            start = index
            end = state.ctrlRowIndex
          }
          for (let i = start; i < end; i++) {
            toggleRowSelection(props.data[i], indexOf === -1)
          }
        }
        state.ctrlRowIndex = index
      }
      emits('selectClick', state.selectedRows, bool, row, index)
    }
  )
  // 获取设置列宽
  const getColWidth = () => {
    columnsData.value.forEach((item) => {
      state.colWidth.push(item.width)
    })
  }
  // 全选或全不选事件
  const toggleSelection = (bool) => {
    // boolean=true全选，false全不选
    if (bool) {
      // 用于多选表格，切换所有行的选中状态
      state.selectedRows = [...props.data]
      // state.selectChecked = 1
    } else {
      // 用于多选表格，清空用户的选择
      state.selectedRows.splice(0, state.selectedRows.length)
      // state.selectChecked = 0
    }
  }
  // 拖动时的垂直线
  const setTableDragLine = (event) => {
    nextTick(() => {
      // 当前表格偏移位置
      const tableOffset = getOffset(el.value)
      let dragLine = el.value.querySelector('.table-drag-line')
      if (dragLine) {
        dragLine.style.left = event.pageX - tableOffset.left + 'px'
        dragLine.style.height = tableOffset.height + 'px'
      }
    })
  }
  const setTHWidth = () => {
    if (!props.drag) {
      return
    }
    const th = el.value && el.value.querySelectorAll('th')
    //      console.log(th)
    state.colWidth = []
    th.forEach((item) => {
      state.colWidth.push(item.offsetWidth + 'px')
    })
  }
  const mouseDown = (obj) => {
    if (!props.drag) {
      return
    }
    if (!state.isSetThWidth) {
      // 重新设置表头的实际宽，仅在第一次点击时重置
      setTHWidth()
      state.isSetThWidth = true
    }
    state.dragHead = {
      mouseDown: true,
      oldX: obj.evt.pageX,
      oldWidth: parseInt(state.colWidth[obj.index].replace('px', '')) || 0, // 拖动前的单元格宽
      index: obj.index
    }
    setTableDragLine(obj.evt)
    // 不让选择
    obj.evt.preventDefault()
  }
  const mouseMove = (obj) => {
    if (!props.drag) {
      return
    }
    const event = obj.evt
    let newWidth = state.dragHead.oldWidth + (event.pageX - state.dragHead.oldX) // 移动鼠标实现宽
    // console.log(newWidth)
    // 如果设置了最小宽或最大
    if (props.dragWidth[0] > 0 && newWidth < props.dragWidth[0]) {
      return
    }
    if (props.dragWidth[1] > 0 && newWidth > props.dragWidth[1]) {
      return
    }
    if (state.dragHead.mouseDown) {
      setTableDragLine(event)
      // 拖动时有可能会存在意外，这里也限制一下
      if (props.dragWidth[0] > 0 && newWidth < props.dragWidth[0]) {
        newWidth = props.dragWidth[0] // 过小时使用最小值
      }
      if (props.dragWidth[1] > 0 && newWidth > props.dragWidth[1]) {
        newWidth = props.dragWidth[1] // 超出限制时使用最大值
      }
      state.colWidth[state.dragHead.index] = newWidth + 'px'
    }
  }
  const headMouseUp = () => {
    if (props.drag && state.dragHead && state.dragHead.mouseDown) {
      emits('dragChange', state.colWidth)
    }
    state.dragHead = {
      mouseDown: false,
      oldX: '',
      oldWidth: '',
      index: ''
    }
  }
  // 表头所有事件
  const tableHeadEvent = (type, obj) => {
    switch (type) {
      case 'checkboxChange':
        toggleSelection(obj)
        emits('selectClick', state.selectedRows, obj)
        break
      case 'mouseDown':
        mouseDown(obj)
        break
      case 'mouseMove':
        mouseMove(obj)
        break
      case 'sortClick':
        emits('sortChange', obj)
        break
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
  // 用于清空排序条件
  const clearSort = () => {
    tableHeadEl.value.sortBy = {}
  }
  const keyup = (evt) => {
    if (evt.key === 'Control') {
      // 恢复
      state.ctrlIsDown = false
      state.ctrlRowIndex = -1
    }
  }
  const keydown = (evt) => {
    // console.log(evt)
    if (evt.key === 'Control' && !state.ctrlIsDown) {
      state.ctrlIsDown = true
    }
  }
  const scrollHandle = () => {
    const scrollTop = el.value.scrollTop
    const scrollLeft = el.value.scrollLeft
    tableHeadEl.value.scrollTop(scrollTop)
    // 左右滚动固定
    const fixedLeft = el.value.querySelectorAll('.left')
    if (fixedLeft.length > 0) {
      // left
      if (scrollLeft > 0) {
        for (let i = 0, len = fixedLeft.length; i < len; i++) {
          fixedLeft[
            i
          ].style.transform = `translateX(${scrollLeft}px) translateZ(90px)`
          fixedLeft[
            i
          ].style.webkitTransform = `translateX(${scrollLeft}px) translateZ(90px)`
        }
      } else {
        for (let i = 0, len = fixedLeft.length; i < len; i++) {
          fixedLeft[i].style.transform = ''
        }
      }
    }
    fixedRight(scrollLeft)
  }
  const fixedRight = (scrollLeft) => {
    const fixedRight = el.value.querySelectorAll('.right')
    const tableWidth = el.value.querySelector('table').offsetWidth
    // 可移动的最大宽
    // div可见宽
    let moveMaxWidth = scrollLeft - (tableWidth - el.value.clientWidth)
    if (fixedRight.length > 0) {
      for (let i = 0, len = fixedRight.length; i < len; i++) {
        fixedRight[
          i
        ].style.transform = `translateX(${moveMaxWidth}px)translateZ(90px)`
        fixedRight[
          i
        ].style.webkitTransform = `translateX(${moveMaxWidth}px)translateZ(90px)`
      }
    }
  }
  const fixedHead = () => {
    // 如果有高和表头，则固定表头
    if (props.height && props.showHeader && el) {
      el.value.addEventListener('scroll', scrollHandle, false)
    }
    // 目前初始时获取到的表格宽(tableWidth)有问题，需滚动下才能获取实际的宽，加个setTimeout处理
    setTimeout(() => {
      fixedRight(0) // 初始化时横向滚动条在0位置
    }, 0)
    // fixedRight(0) // 初始化时横向滚动条在0位置
  }
  // 返回已勾选的行
  const getSelectAll = () => {
    return state.selectedRows
  }
  // 监听表格滚到
  const watchScroll = () => {
    const scrollTop = el.value.scrollTop // 滚到条的位置
    const tableHeight = el.value.clientHeight // 窗口高度
    const scrollHeight = el.value.scrollHeight // 文档高度
    let bottom = false
    if (scrollTop + tableHeight >= scrollHeight - 3) {
      // 到底部
      bottom = true
    }
    emits('scroll', scrollTop, bottom, el.value)
    //scrollFixedBottom()
  }
  // 固定底部滚动条
  const scrollFixedBottom = () => {
    if (!props.fixedBottomScroll) {
      return
    }
    const tableBodyWrapDom = el.value
    const tableBodyDom = tableEl.value
    let innerHeight = window.innerHeight
    // const innerHeight = 400
    if (typeof props.fixedBottomScroll === 'string') {
      const fel = document.querySelector(props.fixedBottomScroll)
      if (fel) {
        innerHeight = fel.offsetHeight + 20
        console.log(innerHeight)
      }
    }
    //console.log(el.value)
    // top为dom上侧距离可视窗口顶部的值
    const { top: tableBodyDomTop } = tableBodyWrapDom.getBoundingClientRect()
    if (tableBodyDomTop > innerHeight) {
      // 此时列表在可视窗口的下侧不可见区域，因此不做任何修改
      tableBodyWrapDom.style.height = 'unset'
      tableBodyWrapDom.style.marginBottom = 'unset'
    } else {
      // 窗口高度 - 列表距顶部值 且 不超过自身实际值
      const wrapHeight = Math.min(
        innerHeight - tableBodyDomTop,
        tableBodyDom.offsetHeight
      )
      tableBodyWrapDom.style.minHeight = '60px'
      // tableBodyWrapDom.style.height = wrapHeight + 'px'
      state.stateHeight = wrapHeight + 'px'
      // 需要用marginBottom填充，以保持列表原有高度，避免页面的纵向滚动条变化导致页面滚动的不流畅
      tableBodyWrapDom.style.marginBottom =
        tableBodyDom.offsetHeight - wrapHeight + 'px'
    }
  }
  // end 固定底部滚动条
  onMounted(() => {
    getColWidth()
    window.addEventListener('keydown', keydown)
    window.addEventListener('keyup', keyup)
    if (props.drag) {
      document.addEventListener('mouseup', headMouseUp)
    }
    if (props.height) {
      el.value.addEventListener('scroll', watchScroll)
    }
    // 固定表头和列初始
    nextTick(() => {
      if (props.fixedBottomScroll) {
        if (typeof props.fixedBottomScroll === 'string') {
          const scrollEl = document.querySelector(props.fixedBottomScroll)
          scrollEl && scrollEl.addEventListener('scroll', scrollFixedBottom)
        } else {
          document.addEventListener('scroll', scrollFixedBottom)
        }
        window.addEventListener('resize', scrollFixedBottom)
      }
      fixedHead()
      scrollFixedBottom()
    })
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', keydown)
    window.removeEventListener('keyup', keyup)
    // window.removeEventListener('resize', resize)
    if (props.drag) {
      document.removeEventListener('mouseup', headMouseUp)
    }
    if (props.height) {
      el.value && el.value.removeEventListener('scroll', watchScroll)
    }
    if (props.fixedBottomScroll) {
      document.removeEventListener('scroll', scrollFixedBottom)
      window.removeEventListener('resize', scrollFixedBottom)
    }
  })
  defineExpose({ getSelectAll, clearSort, toggleRowSelection, toggleSelection })
</script>
<style lang="scss">
@import './styles.scss';
</style>