<template>
  <section class="container" :class="{'is-vertical':isVertical}">
    <slot></slot>
  </section>
</template>
<script>
import { defineComponent,computed,onMounted} from 'vue';

export default defineComponent({
  name:"MyContainer",
  props:{
    direction:{
      type:String,
    }
  },
  setup(props, {slots}){
    const isVertical = computed(() => {
      if(props.direction==='vertical'){
        return true
      }else if(props.direction === 'horizontal'){
        return false
      }
      // 当 <my-container> 容器的子元素中包含 <my-header> 或 <my-footer> 时，全部子元素会垂直上下排列，否则会水平左右排列。
        // 需要先获得插槽中的元素
        // slots从setup中解构出来的default是一个函数
        return slots && slots.default ?
        slots.default().some(vnode => {
          const tag = vnode.type.name
          return tag === 'MyHeader' || tag === 'MyFooter'
        }): false
    })
    return {
      isVertical
    }
  }
  
})
</script>
<style lang="scss" scoped>
.container{
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  min-width: 0;
}
.container.is-vertical{
  flex-direction: column;
}
</style>