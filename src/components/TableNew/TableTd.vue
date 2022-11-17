<script>
import {defineComponent,ref} from 'vue'
import CheckBox from '../Checkbox/CheckBox.vue'
import ToolTip from '../Tooltip/ToolTip.vue'
import Tag from '../Tag/Tag.vue'
export default defineComponent({
  name:'TableTd',
  components:{
    ToolTip,
    CheckBox,
    Tag
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
  emits: ['cellClick', 'toggleExtend'],
  setup(props, {emit}) {
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
    if (Object.keys(props.rowColSpan).length > 0) {
      // 有合并项
      // 不显示
      display =
        props.rowColSpan.rowSpan === 0 || props.rowColSpan.colSpan === 0
      rowspan = props.rowColSpan && props.rowColSpan.rowSpan
      colspan = props.rowColSpan && props.rowColSpan.colSpan
    }
    // 鼠标滑过单元格时显示title提示，当设置为false时不显示，否则使用父级table的设置 todo 待优化
    const hoverTitle = computed(() => {
      if (
        !props.column.title ||
        props.column.tooltip === true ||
        (props.column.tooltip && props.column.tooltip.show)
      ) {
        return null // 当前设置了false不显示，或者是使用了tooltip时不显示
      } else {
        if (props.title) {
          return props.row[props.column.prop]
        }
      }
      return null
    })
    const onCellClick = () => {
      emit(
        'cellClick',
        props.row,
        props.column,
        props.index,
        props.columnIndex
      )
      // 单元格点击
      // evt.stopPropagation()
    }
    const checkValue = ref(props.checked)
    watch(
      () => props.checked,
      (val) => {
        checkValue.value = val
      }
    )
    const extendToggle = () => {
      emit('toggleExtend')
    }
    const defaultSlots = () => {
      const val = props.row[props.column.prop]
      if (props.column.slots && props.column.slots.default) {
        return props.column.slots.default({
          row: props.row,
          index: props.index,
          extend: extendToggle,
          toggle: props.toggle,
          parentRow: props.parentRow
        })
      } else if (props.column.formatter) {//日期格式化
        if (['date', 'dateTime'].includes(props.column.formatter)) {
          if (val) {
            function pS(num) {
              return num.toString().padStart(2, '0')
            }
            const date = new Date(val)
            const ymd = `${date.getFullYear()}-${pS(
              date.getMonth() + 1
            )}-${pS(date.getDate())}`
            switch (props.column.formatter) {
              case 'dateTime':
                return `${ymd} ${pS(date.getHours())}:${pS(
                  date.getMinutes()
                )}:${pS(date.getSeconds())}`
              default:
                return ymd
            }
          }
          return val
        }
        return props.column.formatter(
          props.row,
          props.column,
          val,
          props.index
        )
      } else if (props.column.type === 'selection') {
        // 如果类型是选择，就渲染一个checkbox
        return h(CheckBox, {
          modelValue: checkValue.value,
          onChange: (val) => {
            setSelectedRows(val, props.row, props.index)
            checkValue.value = val // 这里要手动更新，暂不清楚原因
          }
        })
      } else if (
        props.column.tooltip === true ||
        (props.column.tooltip && !props.column.tooltip.disabled)
      ) {
        // 如果类型是tooltip，就渲染一个tooltip
        let obj = { content: val, direction: 'top' }
        if (props.column.tooltip.disabled) {
          obj = Object.assign(obj, props.column.tooltip)
        }
        return h(ToolTip, obj, () => {
          return val
        })
      } else if (typeof props.column.tag === 'object') {
        // 如果存在tag属性，渲染tag组件
        if (!val) {
          return val
        }
        const obj = Object.assign({ size: 'small' }, props.column.tag, {
          type: props.column.tag.dict[val]
        })
        let dictVal = val
        if (typeof props.column.dict === 'object') {
          dictVal = props.column.dict[val]
        }
        //return h(Tag, obj, val)
        return h(Tag, obj, () => {
          return dictVal
        })
      } else if (props.column.type === 'index') {
        return props.index + 1
      } else if (typeof props.column.dict === 'object') {
        if (val) {
          return props.column.dict[val]
        }
        return val
      } else {
        return val
      }
    }
    if (!display) {
      return () => [
        h(
          'td',
          {
            class: classNameTd.value,
            rowspan: rowspan > 1 ? rowspan : null,
            colspan: colspan > 1 ? colspan : null,
            style: 'text-align:' + props.column.align,
            title: hoverTitle.value,
            onClick: onCellClick
          },
          defaultSlots()//子节点
        )
      ]
    } else {
      return () => []
    }
  }
})
</script>