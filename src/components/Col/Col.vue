<template>
  <div :class="colClassName">
    <slot></slot>
  </div>
</template>
<script>
import { defineComponent,computed } from 'vue';
export default defineComponent({
  name:"col",
  props:{
    span:{//栏位数
      type: [Number, String], 
      default: 0 
    },
    offset:{//偏移量
      type: [Number, String], 
      default: 0
    }
  },
  setup(props){
    let colClassName = computed(() => {
      // 默认样式和前缀
      let prefix = "bp-col";
      let className = [];
      Number(props.span) !== 0 ? className.push(`${prefix}-${props.span}`) : "";
      
      // 偏移量
      Number(props.offset) !== 0
        ? className.push(`${prefix}-offset-${props.offset}`)
        : "";
      return className;
    })
    return {
      colClassName
    }
  }
})
</script>
<style lang="scss" scoped>
  @import "./style.scss"
  </style>