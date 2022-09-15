<template>
  <aside class="my-aside" :style="{width}">
    <slot></slot>
  </aside>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name:"MyAside",
  props:{
    width:{
      type:String,
      default:'300px'
    }
  }
})
</script>
<style lang="scss" scoped>
.my-aside{
  overflow: auto;
  box-sizing: border-box;
  // 不缩小
  flex-shrink: 0;
}
</style>