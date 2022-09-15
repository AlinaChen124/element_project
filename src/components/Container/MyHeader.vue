<template>
  <header class="my-header" :style="{height}">
    <slot></slot>
  </header>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name:"MyHeader",
  props:{
    height:{
      type:String,
      default:'60px'
    }
  }
})
</script>
<style lang="scss" scoped>
.my-header{
  padding: 0 20px;
  height: 60px;
  box-sizing: border-box;
  flex-shrink: 0;
}
</style>