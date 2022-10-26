<template>
  <transition>
    <div>
      <div>
        <svg viewBox="0 0 50 50"></svg>
      </div>
    </div>
  </transition>
</template>
<script>
import { defineComponent,reactive,onMounted,nextTick,watch } from 'vue'
export default defineComponent({
  name:'Loading',
  props:{
    text:String,
    background:String,//遮罩颜色
    spinner:String,//自定义加载图标名称
    lock:Boolean,
    el:{
      type:Object,
      default:()=>{ }
    },
    zIndex:Number,
    modelValue:{
      type:Boolean,
      default:false
    }
  },
  setup(props){
    const getScrollbarWidth = (bool) => {
      // 取滚动条的宽
      const hasScroll =
        document.body.scrollHeight >
        (window.innerHeight || document.documentElement.clientHeight)
      const scrollDiv = document.createElement('div')
      scrollDiv.style.cssText =
        'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;'
      document.body.appendChild(scrollDiv)
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
      document.body.removeChild(scrollDiv)
      if (bool) {
        return { hasScroll: hasScroll, width: scrollbarWidth }
      } else {
        return scrollbarWidth
      }
    }
    const state = reactive({
      visible:props.modelValue,
      scrollbarWidth:17
    })
    watch(()=>{
      ()=>props.modelValue,
      (bool)=>{
        state.visible = bool
      }
    })
    onMounted(() => {
      nextTick(() => {
        state.scrollbarWidth = getScrollbarWidth()
      })
    })
    const open = () => {
      // console.log('open')
      state.visible = true
      if (props.lock) {
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = state.scrollbarWidth + 'px'
      }
    }
    const close = () => {
      // remove false通过指令引用，这时不能移除
      state.visible = false
      if (props.lock) {
        // 解锁
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }
    return{
      state,
      open,
      close
    }
  }
})
</script>