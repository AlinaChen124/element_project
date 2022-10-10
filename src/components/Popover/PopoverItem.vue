<template>
  <div
    class="popover-box"
    @mouseenter="mouseenterTriggerHandler"
    @mouseleave="mouseleaveTriggerHandler"
  >
    <transition :name="transition"
      @after-enter = 'handleAfterEnter'
      @after-leave = 'handleAfterLeave'
    >
      <div v-show="!disabled&&showPopover"
        :class="['popover-outbox',placement,popoverClass]"
        :aria-hidden="disabled || !showPopover ? 'true' : 'false'"
      >
        <!-- popover arrow -->
        <i class="popover-arrow" ref="popoverArrow"></i>
        <!-- popover content -->
        <div :style="popoverStyles" :class="['popover-box-content']">
          <div v-if="title" class="popover-title">{{title}}</div>
          <slot>{{content}}</slot>
        </div>
      </div>
    </transition>
    <!-- referrence content -->
    <div ref="referrence"
      class="reference-content"
      @click="clickTriggerHandler"
      @mousedown="focusTriggerHandler"
      @mouseup="blurTriggerHandler"
    >
      <slot name="referrence"></slot>
    </div>
  </div>
</template>
<script>
import { defineComponent,computed,ref,onMounted } from 'vue'
export default defineComponent({
  name:'PopoverItem',
  emits:['after-enter','after-leave'],
  props:{
    width:{
      type:[Number,String]
    },
    placement:{ //popover展示的位置，可选方向与tooltip相同
      type:String,
      default:'top'
    },
    content:{//popover中的内容
      type:[String]
    },
    popclass:{//popover自定义样式
      type:[String]
    },
    title:{// popover标题
      type:[String]
    },
    transition:{// popover弹出动画设置
      type:String,
      default:'slide-fade'
    },
    disabled:{// popover禁用
      type:Boolean,
      default:false
    },
    trigger:{// 触发方式-hover，focus，click，manual
      type:String,
      default:'click'
    },
    modelVal:{
      type:Boolean,
      default:true,
    }
  },
  setup(props,{emit}){
    const visible = ref(false)
    // 设置一个计算属性用于检测popover是显示还是隐藏
    const showPopover = computed(()=>{
      if(props.trigger!=='manual'){
        return visible.value
      }else{
        console.log(props.modelValue);
        //自定义触发
        return props.modelValue;
      }
    })
    const popoverStyles = computed(()=>{
      let style = {}
      // ??空值合并操作符：只有当左侧为null和undefined时，才会返回右侧的数
      if(props.width??null){
        style.width = props.width+'px'
      }
      return style
    })
    // 设置reference和arrow的位置
    const referrence = ref(null)
    const popoverArrow = ref(null)
    onMounted(() => {
      if(props.placement.includes('top')||props.placement.includes('bottom')){
        let clientWidth = referrence.value.clientWidth
        popoverArrow.value.style.setProperty(
          '--geticonsite',
          clientWidth/2+'px'
        )
      }else if(props.placement.includes('left')||props.placement.includes('right')){
        let clientHeight = referrence.value.clientHeight
        popoverArrow.value.style.setProperty(
          '--geticonsite',
          clientHeight/2+'px'
        )
      }
    })

    // popover显示触发过程
    // 点击触发
    const clickTriggerHandler = ()=>{
      if(props.trigger.toLowerCase() =='click'){
        if(!props.disabled){
          visible.value=!visible.value
        }
      }
    }
    // 聚焦触发
    const focusTriggerHandler = ()=>{
      if(props.trigger.toLowerCase()=='focus'){
        if(!props.disabled){
          visible.value = true
        }
      }
    }
    // 失焦消失
    const blurTriggerHandler = ()=>{
      if(props.trigger.toLowerCase()=='focus'){
        if(!props.disabled){
          visible.value = false
        }
      }
    }
    // 鼠标移入触发-hover
    const timer = ref(null)
    const mouseenterTriggerHandler = ()=>{
      if(props.trigger.toLowerCase()=='hover'){
        if(!props.disabled){
          clearTimeout(timer.value)
          visible.value = true
        }
      }
    }
    // 鼠标移出触发
    const mouseleaveTriggerHandler = ()=>{
      if(props.trigger.toLowerCase()=='hover'){
        if(!props.disabled){
          timer.value = setTimeout(()=>{
            visible.value = false
          },300)
        }
      }
    }
    //弹窗显示时触发
    const handleAfterEnter = ()=>{
      emit('after-enter')
    }
    //弹窗消时时触发
    const handleAfterLeave = ()=>{
      emit('after-leave')
    }
    return {
      visible,
      showPopover,
      popoverStyles,
      referrence,
      popoverArrow,
      clickTriggerHandler,
      focusTriggerHandler,
      blurTriggerHandler,
      mouseenterTriggerHandler,
      mouseleaveTriggerHandler,
      handleAfterEnter,
      handleAfterLeave
    }
  }
})
</script>
<style scoped lang="scss">
@import './styles.scss'
</style>