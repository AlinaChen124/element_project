<!-- 定义表头 -->
<template>
  <thead v-if="showHeader" ref="el">
    <tr v-for="thLayer in headMaxLayer" key="thLayer" >
      <th
        v-for="(th,thIndex) in getColumnsFilter(thLayer)"
        :key="thIndex"
        :colspan="th._colspan"
        :rowspan="th._rowspan"
        :title="getShowHoverTitle(th)"
        @mousemove="headMouseMove(thIndex)"
      >
      <!-- 如果有选择框就渲染checkbox -->
      <check-box
        v-if="th.type=='selection'"
        v-model="state.checkboxChecked"
        value="1"
        @change="checkboxChange"
      ></check-box>
      <!-- 否则就递归table-header -->
        <template v-else>
          <table-header
            v-if="th.slots&&th.slots.header"
            :data="th"
            :index="thIndex"
          ></table-header>
          <span v-else>{{th.label}}</span>
        </template>
        <a
          v-if="drag && th.drag !== false"
          class="drag-line"
          @mousedown="headMouseDown(thIndex)"
        ></a>
      </th>
    </tr>
  </thead>
</template>
<script>
import { defineComponent,ref,reactive ,onMounted} from 'vue'
import HeaderSlot from './HeaderSlot.vue'
import CheckBox from '../Checkbox/CheckBox.vue'
export default defineComponent({
  name:'TableHeader',
  components:{HeaderSlot,CheckBox},
  props:{
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
  },
  emits:['checkboxChange'],
  setup(props,{emit}){
    const el = ref()//获取根元素实例对象
    const getColumns = inject('getColumns',[])
    const getColumnsFilter = (index)=>{
      return getColumns.value.filter((item)=>{
        // 元素类型不是扩展，且层数与索引相同
        return item.type!=='extend'&& item._layer==index
      })
    }
    const state = reactive({
      checkboxChecked:props.selectChecked.toString()
    })
    const checkboxChange = (val)=>{
      emit('checkboxChange',!!val)// 将val转化为boolean
    }
    const headMouseDown = (index)=>{
      emit('mouseDown',index)
    }
    const getShowHoverTitle = (item)=>{
      // 鼠标滑过单元格时显示title提示，当设置为false时不显示，否则使用父级table的设置
      if (!item.title) {
        return null // 当前设置了false不显示
      } else {
        if (props.title) {
          return item.label
        }
      }
      return null
    }
    const headMouseMove = (index)=>{
      emit('mouseMove',index)
    }
    onMounted(() => {
      console.log(getColumns);
    })
    return {
      el,
      state,
      getColumnsFilter,
      headMouseDown,
      headMouseMove,
      getShowHoverTitle,
      checkboxChange
    }
  }
})
</script>
