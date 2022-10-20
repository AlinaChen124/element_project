<template>
  <div>
    <div ref="el">
      <table ref="tableEl">
        <colgroup>
          <col>
        </colgroup>
        <table-header 
          ref="tableHeadEl"
          :drag="drag"
          :title="title"
          :show-header="showHeader"
          :sort-single="sortSingle"
          :select-checked="selectChecked"
          :head-max-layer="state.headMaxLayer"
        ></table-header>
        <table-body></table-body>
      </table>
    </div>
  </div>
</template>
<script>
import TableHeader from './TableHeader.vue'
import TableBody from './TableBody.vue'
import {defineComponent,watch,ref,reactive,computed,provide,onMounted} from 'vue'
export default defineComponent({
  name:'Table',
  components:{
    TableHeader,
    TableBody
  },
  props:{
    data:{
      type:Array,
      default:()=>[]
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
    ellipse:{// 表格单元格文字溢出显示…，在不指定列宽时，各列平分表格宽
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
    extendToggle:Boolean,// 默认展开扩展
    sortSingle:Boolean,// 单个排序
    columns:{// 表头数据
      type:Array
    },

  },
  setup(props,{slots}){
    const el = ref()// 获取div实例
    const tableEl = ref()// 获取table实例对象
    const tableHeadEl = ref() // 获取tableHeader实例对象
    const columnsData = ref([]) // 每列数据
    const state = reactive({
      colWidth:[],//每列的宽度
      selectedRows:[],//选中的行
      isSetThWidth:false,//用于记录是否已经重新设置过表头的实际宽度
      headMaxLayer:1,//表头层级
      stateHeight: props.height
    })
    // 预防中途修改行高
    watch(()=>props.height,(val)=>{
      state.stateHeight = val
    })
    // 计算选中
    const selectChecked = computed(()=>{
      // 表头checkbox勾选状态0全不选，1全选，2半选
      const len = state.selectedRows.length
      if(len === 0){
        return 0 // 全不选
      }else if(len === props.data.length){
        return 1 // 全选
      }else{
        return 2 // 半选
      }
    })
    // 
    watch(()=>props.columns,
    ()=>{
      columnsData.value = []
      formatColumns()
    }
    )
    // 格式化column
    const formatColumns = ()=>{
      columnsData.value.forEach((item)=>{
        if(!item.children){
          // 没有子集时，计算纵向合并
          const rowspan = state.headMaxLayer - item._layer + 1// 纵向合并
          if(rowspan>1){
            item._rowspan = rowspan // 计算横向占比
          }
        }else{
          // 计算横向合并
          const colspan = columnsData.value.filter((col)=>{
            const prop = col._tProps?.split(',')
            return prop && prop.includes(item.prop) && !col.children
          })
          if(colspan?.length>0){
            item._colspan = colspan.length // 纵向个数？
          }
        }
      })
    }
    // 使用columns(表头数据)传参时
    const getColumns = (data,layer=0,tProps='')=>{
      layer++
      if(state.headMaxLayer<layer){
        state.headMaxLayer = layer
      }
      // 使用传参形式
      // 模板里有slots的时候，将slots添加到columns里,新增一列内容
      data.forEach((item)=>{
        const prop = item.prop || ''
        const newTprops = tProps ? tProps + ','+ prop : prop
        if(item.children){
          //多级表头
          getColumns(item.children,layer,newTprops)
        } else {
          // 有具名插槽时Object.keys().length获取对象长度
          if(Object.keys(slots).length){
            for(let key in slots){
              if(item.prop == key){
                if(!item.slots){
                  item.slot = {}
                }
                // 处理表头数据里的层级，添加slots属性
                Object.assign(item.slots, {default:slots[key]})
              }
              if(item.prop + '-header'===key){
                if(!item.slots){
                  item.slots={}
                }
                Object.assign(item.slots, {header:slots[key]})
              }
            }
          }
        }
        columnsData.value.push({
          ...item,
          _layer: layer,
          _tProps: newTprops
        })
      })
    }
     // 表头使用参数形式
    if (props.columns) {
      formatColumns()
    }
    provide('getColumns',columnsData)// columns的值不是双向的
    onMounted(()=>{
      console.log(columnsData);
    })
    return{
      el,
      tableEl,
      tableHeadEl,
      state,
      selectChecked
    }
  }
})
</script>