<script>
import {defineComponent,ref} from 'vue'
import ToolTip from '../Tooltip/ToolTip.vue'
export default defineComponent({
  name:'TableTd',
  components:{
    ToolTip
  },
  props:{
    column:{
      type:Object,
      default:()=>{}
    },
    columnIndex:{//当前列号
      type:Number,
      default:0
    },
    row:{
      type:Object,
      default:()=>{}
    },
    index:{//当前行号
      type:Number,
      default:0
    },
    toggle:Boolean,//扩展子级展开和收起状态
    parentRow:Object,//子级下拉时包含父级的信息
    title:Boolean,
    checked:Boolean,
    colspan:{// 有扩展列时才传
      type:Number,
      default:0
    },
    rowcolspan:{
      type:Object,
      default:()=>{}
    },
    rowspancolspanlist:{
      type:Array,
      default:()=>[]
    }
  },
  setup(props) {
    // 接收table.vue传进来的SetSelectedRows
    const setSelectedRows = inject('SetSelectedRows')
    let classNameTd = ref(props.column.fixed)
    let pcl = ref(props.column.className)
    // 列固定
    if(pcl.value&&props.column.fixed){
      classNameTd.value += ' '+pcl.value
    }else{
      classNameTd.value = pcl.value
    }
    let display = false
    let rowspan = 0
    let colspan = ref(props.colspan).value

  }
})
</script>