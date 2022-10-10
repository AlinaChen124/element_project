<template>
  <transition
    name="menu"
    @before-enter="beforeEvent"
    @after-enter="afterEvent"
    @after-leave="afterEvent"
    @before-leave="beforeEvent"
  >
    <ul 
      :class="{['layer-'+layer]:true,'is-child':itemUl}"
      v-show="!itemUl||visibleList.includes(itemUl.key)"
      :data-height="getUlHeight(itemUl)"
    >
      <li
        v-for="item in items"
        :key="item.key"
        :class="{
          disabled:item.disabled,
          'is-down':visibleList.includes(item.key),
          selected:item.key == selectedKey
        }"
        @mouseenter="mouseenter(item)"
        @mouseleave="mouseleave(item)"
        @click.stop="click(item)"
      >
      <span class="menu-title">
        <tool-tip
          :content="item.label"
          direction="right"
          :x="15"
          :disabled="!(layer === 0 && !item.children && menuProps.collapse)"
        >
        <Icon name="item.icon" v-if="item.icon" class="icon"></Icon>
        </tool-tip>
        <span class="name">{{ item.label }}</span>
        <Icon name="arrow-down" v-if="item.children" class="icon-arrow"></Icon>
      </span>
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
import ToolTip from '../Tooltip/ToolTip.vue'
import Icon from '../Icon/icon.vue'
export default defineComponent({
  name:"MenuItem",
  emits:['click','select'],
  components:{
    ToolTip,
    Icon
  },
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
    const click = (item)=>{
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
    }
    const pushOrSplice = (item, add) => {
      if (item.disabled) {
        return
      }
      if (add) {
        // 有子级时才处理
        if (item.children && !visibleList.value.includes(item.key)) {
          // 将子级目录添加到可视列表中
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
<style lang="scss">
  @import './styles.scss';
</style>