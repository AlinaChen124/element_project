<template>
  <div
  >
  <menu-item :items="items" @click="click" @select="select"></menu-item>
  </div>
</template>
<script>
import { defineComponent,provide,onMounted,ref,onBeforeUnmount } from 'vue';
import MenuItem from './MenuItem.vue';
export default defineComponent({
  name:"myMenu",
  emits:['click','select'],
  components:{
    MenuItem
  },
  props:{
    // 显示模式：横向、竖向
    mode:{
      type:String,
      default:'vertical',
      validator:(value)=>{
        return ['horizontal','vertical'].includes(value)
      }
    },
    items:{
      type:Array
    },
    classname:{
      type:String,
      default:''
    },
    // 是否开启折叠
    collapse:{
      type:Boolean,
      default:false
    },
    // 子菜单展开的触发方式(hover只在 mode 为 horizontal 时有效)
    trigger:{
      type:String,
      default:'hover',
      validator:(value)=>{
        return ['hover','click'].includes(value)
      }
    },
    theme:{
      type:String,
      default:'light',
      validator:(value)=>{
        return ['light','dark'].includes(value)
      }
    },
    // 子菜单项高，仅在mode为vertical时，用于计算高度平滑动画效果
    liheight:{
      type:Number,
      default:40
    },
    openkeys:{
      type:Array,
      default:()=>[]
    },
    selectedKey:{
      type:String,
      default:''
    },
    router:{
      type:Boolean,
    }
  },
  setup(props,context){
    provide('MenuProps',props)
    // 展开的项集合
    const visibleList  = ref(props.openkeys)
    provide('MenuVisibleList',visibleList)//非响应式的，需要一个对应的方法
    provide('MenuVisibleListChange',(key,add)=>{
      if(add){
        visibleList.value.push(key)
      }else{
        const index = visibleList.value.indexOf(key)
        visibleList.value.splice(index,1)
      }
    })
    // 当前选中项
    const selectKey = ref(props.selectedKey)
    provide('MenuSelectKey', selectKey)
    provide('MenuSelectKeyChange', (val) => {
      selectKey.value = val
    })
    // 收起全部
  const slideUp = () => {
    visibleList.value = []
    selectKey.value = ''
  }
  const click = (item) => {
    context.emit('click', item)
  }
  const select = (item) => {
    context.emit('select', item)
  }
  onMounted(() => {
    if (props.trigger === 'click' && props.mode === 'horizontal') {
      document.addEventListener('click', slideUp, false)
    }
  })
  onBeforeUnmount(() => {
    if (props.trigger === 'click' && props.mode === 'horizontal') {
      document.removeEventListener('click', slideUp, false)
    }
  })
    return{
      visibleList,
      selectKey,
      click,
      select,
    }
  }
})
</script>

