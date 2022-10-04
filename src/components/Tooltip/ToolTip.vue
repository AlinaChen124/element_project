<template>
  <span ref="el" :class="tooltip-box">
    <slot></slot>
    <transition name="tooltip-fade">
      <div 
        ref="tooltipEl"
        v-if="getIf($slots)"
        v-show="state.visible"
        :class="['tooltip',direction,className]"
        :style="state.tooltipStyle"
        @click.stop=""
        >
        <i class="arrow"></i>
        <span v-if="content" v-html="content"></span>
        <slot v-else name="content"></slot>
      </div>
    </transition>
  </span>
</template>
<script>
import Icon from '../Icon/icon.vue'
import {getOffset,getWindow} from '../../hooks/util'
import { defineComponent, ref,reactive, nextTick,watch,onMounted,onBeforeUnmount } from 'vue'

export default defineComponent({
  name:"ToolTip",
  emits:['click'],
  components:{
    Icon
  },
  props:{
    content:{
      type:String
    },
    direction:{
      type:String,
      default:'top-left'
    },
    maxWidth:{
      type:Number,
      default:500
    },
    delay:{
      type:Number,
      default:0
    },
    always:{
      type:Boolean
    },
    appendtobody:{
      type:Boolean,
      default:true
    },
    x:{
      type:Number,
      default:0
    },
    y:{
      type:Number,
      default:0
    },
    classname:{
      type:String
    },
    trigger:{
      type:String,
      default:'hover'|'click'
    },
    style:{
      type:Object
    },
    disabled:{
      type:Boolean,
      default:false
    }
  },
  setup(props,{emit}){
    const tooltipEl = ref()
    const state = reactive({
      clearTime:0,
      visible:false,
      tooltipStyle:{}
    })
    const el = ref(null)
    const hasAppendToBody = ref(false)
    // 监听对象中的某个属性要用函数的方式
    watch(()=>props.disabled,
      (val)=>{
        nextTick(()=>{
          if(!val&&props.appendtobody&&tooltipEl.value&&!hasAppendToBody.value){
            document.body.appendChild(tooltipEl.value)
            hasAppendToBody.value = true
          }
        })
      }
    )
    onMounted(() => {
      nextTick(()=>{
        if(props.always){
          state.visible = true
          setPosition()
        }
        if(props.trigger == 'click'){
          document.addEventListener('click',mouseClick,false)
        }else{
          el.value.addEventListener('mouseenter',mouseEnter,false)
          el.value.addEventListener('mouseleave',mouseLeave,false)
        }
        if(props.appendtobody&&tooltipEl.value){
          document.body.appendChild(tooltipEl.value)
          hasAppendToBody.value = true
        }
      })
    })
    onBeforeUnmount(() => {
      if (props.trigger === 'click') {
        document.removeEventListener('click', mouseClick, false)
      } else {
        el.value.removeEventListener('mouseenter', mouseEnter, false)
        el.value.removeEventListener('mouseleave', mouseLeave, false)
      }
      if (props.appendToBody && tooltipEl.value) {
        document.body.removeChild(tooltipEl.value)
      }
    })
    const getIf = (slot)=>{
      if(props.disabled){
        return
      }
      return props.content||slot.content
    }
    const translate = (px) =>{
      // 通过transform平移标签时，如平移的单位为非偶数，会出现字体模糊，这里强制取偶
      if(px%2==0){
        return px
      }else{
        return px+1
      }
    }
    // 设置点击的回调函数
    const mouseClick = (e)=>{
      if(!props.always){
        if(e && el.value.contains(e.target)){
          state.visible = true
          setPosition()
        }else{
          state.visible = false
        }
      }
      emit('click', state.visible)
    }
    // 设置mouseenter的回调函数
    const mouseEnter = (e) =>{
      if(props.disabled) return
      if(!props.always){
        setPosition()
        window.clearTimeout(state.clearTime)
        state.visible = true
        // 提示内容上添加事件
        if(props.delay && tooltipEl.value){
          tooltipEl.value.addEventListener('mouseenter', toolTipEnter, false)
          tooltipEl.value.addEventListener('mouseleave', toolTipLeave, false)
        }
      }
    }
    const mouseLeave = (e)=>{
      state.clearTime = window.setTimeout(()=>{
        state.visible = false
      },props.delay)
    }
    // 设置tooltip内部的鼠标事件
    const toolTipEnter = (e)=>{
      window.clearTimeout(state.clearTime)
    }
    const toolTipLeave = (e)=>{
      mouseLeave()
      // 同时移除事件
      tooltipEl.value.removeEventListener('mouseenter', toolTipEnter, false)
      tooltipEl.value.removeEventListener('mouseleave', toolTipLeave, false)
    }
    // 设置tooltip的位置
    const setPosition = ()=>{
      const offset = getOffset(el.value)
      const windowWidth = getWindow().width
      const space = props.y+8 //当前标签与提示语之间的距离
      let style = {
        maxWidth:props.maxWidth + 'px'
      }
      if(props.appendtobody){
        const windowHeight = getWindow().height
        const bottom = windowHeight-offset.top+space +'px'
        switch(props.direction){
          case 'top-left':
            style.left = offset.left + props.x + 'px'
            style.bottom = bottom
            break
          case 'top':
            // 先让提示左边和当前标签中间对齐（偏移位置+标签宽的一半），再向左移50%
            style.left = translate(offset.left + offset.width/2 + props.x)+ 'px'
            style.transform = 'translateX(-50%)'
            style.bottom = bottom
            break
          case 'top-right':
            style.right = windowWidth - (offset.left + offset.width + props.x) + 'px'
            style.bottom = bottom
            break
          case 'left':
            // top先让提示语顶部跟标签中间对齐，再上移50%
            style.top = translate(offset.top + offset.height/2 )+ 'px'
            style.transform = 'translateY(-50%)'
            style.right = windowWidth - (offset.left - 8+props.x) + 'px'
            break
          case 'right':
            // top先让提示语顶部跟标签中间对齐，再上移50%
            style.top = translate(offset.top + offset.height/2 )+ 'px'
            style.transform = 'translateY(-50%)'
            style.left = offset.left + offset.width + 8 + props.x + 'px'
            break
          case 'bottom-left':
            style.left = offset.left + props.x + 'px'
            style.top = offset.top + offset.height + space + 'px'
            break
          case 'bottom':
            style.left = translate(offset.left +offset.width/2 +props.x)+'px'
            style.transform = 'translateX(-50%)'
            style.top = offset.top + offset.height + space + 'px'
            break
          case 'bottom-right':
            style.right = windowWidth - (offset.left + offset.width + props.x) + 'px'
            style.top = offset.top + offset.height + space + 'px'
            break
        }
      }
      state.tooltipStyle = Object.assign({},props.style,style)
    }
    return {
      tooltipEl,
      state,
      el,
      getIf,
      mouseClick,
      mouseEnter,
      mouseLeave,
      toolTipEnter,
      toolTipLeave
    }
  }
})
</script>
<style lang="scss">
  @import './styles.scss';
  </style>