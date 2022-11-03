<template>
  <div :class="['divider', direction]" :style="borderTopOrLeft">
    <span class="divider-text" :class="[contentposition]">
      <slot></slot>
    </span>
  </div>
</template>
<script>
import { defineComponent,computed } from 'vue';
export default defineComponent({
  name:"Divider",
  props:{
    direction:{
      type:String,
      default:'',
      validator:(value)=>{
        return ['vertical',''].includes(value)
      }
    },
    borderstyle:{
      type:String,
      default:'solid',
      validator: value => ['dashed','dotted','solid'].includes(value)
    },
    contentposition:{
      type:String,
      default:'center',
      validator: value => ['left','right','center'].includes(value)
    },
    padding:String
  },
  setup(props){
    const borderTopOrLeft = computed(()=>{
      let position = 'borderTopStyle'
      // 水平返回上下边距，垂直返回左右边距
      let padding = props.padding? `0 ${props.padding}`:''
      if(props.direction === 'vertical'){
        position = 'borderLeftStyle'
        padding = props.padding?`${props.padding} 0`:''
      }
      return {
        [position]:props.borderstyle,
        margin: padding
      }
    })
    console.log(borderTopOrLeft);
    return {
      borderTopOrLeft
    }
  }
})
</script>
<style lang="scss">
@import './styles.scss';
</style>