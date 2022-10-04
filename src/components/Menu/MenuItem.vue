<template>
  <transition
    name="menu"
    @before-enter="beforeEvent"
    @after-enter="afterEvent"
    @after-leave="afterEvent"
    @before-leave="beforeEvent"
  >
    <ul 
    
    >
      <li
        v-for="item in items"
        :key="item.key"
        @mouseenter="mouseenter(item)"
        @mouseleave="mouseleave(item)"
        @click="click(item, $event)"
      >
      <span class="name">{{ item.label }}</span>
      <menu-item
        v-if="item.children"
        :items="item.children"
        :itemUl="item"
        :layer="layer + 1"
        @click="clickEmit"
        @select="select"
      >
      </menu-item>
    </li>
    </ul>
  </transition>
</template>
<script>
import { defineComponent,watch,ref,computed,inject } from 'vue'
export default defineComponent({
  name:"MenuItem",
  emits:['click','select'],
  props:{
    items:{
      type:Array
    },
    itemUl:{
      type:Object
    },
    layer:{
      type:Number,
      default:0
    }
  },
  setup(props,context){
    // 处理所有展开的项
    const visibleList = inject('MenuVisibleList', [])
    const menuVisibleListChange = inject('MenuVisibleListChange')
    // 当前选中的项
    const selectedKey = inject('MenuSelectKey')
    const selectedKeyChange= inject('MenuSelectKeyChange')
    const menuProps= inject('MenuProps', {})
    const mouseenter = (item)=>{
      if(item.children&&item.children.length>0){
        onMouseEvent(item,true)
      }
    }
    const mouseleave = (item) => {
      if (item.children && item?.children.length > 0) {
        onMouseEvent(item, false)
      }
    }
    const onMouseEvent = function(item,add){
      if(
        (menuProps.trigger === 'hover' && menuProps.mode === 'horizontal') ||
        (menuProps.mode === 'vertical' && menuProps.collapse)
      ){
        pushOrSplice(item,add)
      }
    }
    const click = (item,event)=>{
      if(item.disabled){
        return
      }
      if(menuProps.trigger==='click'||menuProps.mode ==='vertical'){
        pushOrSplice(item,!visibleList.value.includes(item.key))
      }
      // 如果没有子级，设置当前选中项
      if (!item.children) {
        selectedKeyChange && selectedKeyChange(item.key)
        emits('select', item)
        // menuProps.router && router.push(item.key)
      }
      context.emit('click', item)
      event.stopPropagation()
    }
    const pushOrSplice = (item, add) => {
      if (item.disabled) {
        return
      }
      if (add) {
        // 有子级时才处理
        if (item.children && !visibleList.value.includes(item.key)) {
          menuVisibleListChange && menuVisibleListChange(item.key, add)
        }
      } else {
        menuVisibleListChange && menuVisibleListChange(item.key, add)
      }
    }
    const getUlHeight = (item) => {
      if (item && item.children) {
        return item.children.length * menuProps.liHeight + (item.childHeight || 0)
      }
      return null
    }
    const select = (item) => {x
      context.emit('select', item)
    }
    const clickEmit = (item) => {
      context.emit('click', item)
    }
    // 高度展开动画
    const beforeEvent = (node) => {
      const height = node.getAttribute('data-height')
      if (height) {
        node.style.height = height + 'px'
        node.style.overflow = 'hidden'
      }
    }
    const afterEvent = (node) => {
      node.style.height = ''
      node.style.overflow = ''
    }
    return{
      visibleList,
      menuVisibleListChange,
      selectedKey,
      selectedKeyChange,
      menuProps,
      mouseenter,
      mouseleave,
      getUlHeight,
      click,
      select,
      clickEmit,
      beforeEvent,
      afterEvent
    }
  }
})

</script>