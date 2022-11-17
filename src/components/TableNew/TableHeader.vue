<template>
  <thead v-if="showHeader" ref="el">
    <tr v-for="thLayer in headMaxLayer" :key="thLayer" :class="{ drag: drag }">
      <th
        v-for="(th, thIndex) in getColumnsFilter(thLayer)"
        :key="thIndex"
        :class="[th.fixed, th.className]"
        :style="{ textAlign: th.align }"
        :title="getShowHoverTitle(th)"
        :colspan="th._colspan"
        :rowspan="th._rowspan"
        @mousemove="headMouseMove($event, thIndex)"
      >
        <check-box
          v-if="th.type === 'selection'"
          v-model="state.checkboxChecked"
          :class="{ 'some-select': selectChecked === 2 }"
          value="1"
          @change="checkboxChange"
        />
        <template v-else>
          <table-header
            v-if="th.slots && th.slots.header"
            :data="th"
            :index="thIndex"
          />
          <span v-else>{{ th.label }}</span>
          <span v-if="th.sortBy" class="caret-wrapper">
            <i
              class="sort-caret asc"
              :class="{ active: state.sortBy[th.prop] === 'asc' }"
              @click="sortClick(th.prop, 'asc')"
            ></i>
            <i
              class="sort-caret desc"
              :class="{ active: state.sortBy[th.prop] === 'desc' }"
              @click="sortClick(th.prop, 'desc')"
            ></i>
          </span>
        </template>
        <a
          v-if="drag && th.drag !== false"
          class="drag-line"
          @mousedown="headMouseDown($event, thIndex)"
        ></a>
      </th>
    </tr>
  </thead>
</template>

<script setup>
  import { reactive, inject, watch, ref } from 'vue'
  import  CheckBox  from '../Checkbox/CheckBox.vue'
  import TableHeader from './HeaderSlot.vue'
  const props = defineProps({
    showHeader:Boolean,
    drag:Boolean,
    title:Boolean,
    selectChecked:{//表头checkbox勾选状态0全不选，1全选，2半选
      type:Number,
      default:0
    },
    sortSingle:Boolean,
    headMaxLayer:{
      type:Number,
      default:1
    },
  })
  
  const emits = defineEmits()
  const el = ref()
  const getColumns = inject(`GetColumns`, [])
  const state = reactive({
    checkboxChecked: props.selectChecked.toString(),
    // columns: getColumns,
    sortBy: {}
  })
  watch(
    () => props.selectChecked,
    (v) => {
      state.checkboxChecked = v.toString()
    }
  )
  const getColumnsFilter = (index) => {
    // console.log(index)
    return getColumns.value.filter((item) => {
      return item.type !== 'extend' && item._layer === index
    })
  }
  // 鼠标滑过单元格时显示title提示，当设置为false时不显示，否则使用父级table的设置
  const getShowHoverTitle = (item) => {
    if (!item.title) {
      return null // 当前设置了false不显示
    } else {
      if (props.title) {
        return item.label
      }
    }
    return null
  }
  // 表头拖动
  const headMouseMove = (evt, index) => {
    emitEvent('mouseMove', { evt: evt, index: index })
  }
  const headMouseDown = (evt, index) => {
    emitEvent('mouseDown', { evt: evt, index: index })
  }
  // checkbox勾选事件
  const checkboxChange = (val) => {
    emitEvent('checkboxChange', !!val)
  }
  // 排序事件
  const sortClick = (prop, order) => {
    if (props.sortSingle) {
      // 只支持单个，先清空
      state.sortBy = {}
    }
    state.sortBy[prop] = order
    emitEvent('sortClick', state.sortBy)
  }
  const emitEvent = (type, obj) => {
    emits('event', type, obj)
  }
  // 由table组件调用，固定表头滚动时
  const scrollTop = (scrollTop) => {
    if (scrollTop) {
      el.value.style.transform = `translateY(${scrollTop}px) translateZ(100px)`
      el.value.className = 'transform'
    } else {
      el.value.style.transform = ''
      el.value.className = ''
    }
  }
  defineExpose({ scrollTop })
</script>