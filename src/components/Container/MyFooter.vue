<template>
  <footer class="my-footer" :style="{height}">
    <slot></slot>
  </footer>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name:"MyFooter",
  props:{
    height:{
      type:String,
      default:'60px'
    }
  }
})
</script>
<style lang="scss" scoped>
  .my-footer{
    padding: 0 20px;
    box-sizing: border-box;
    flex-shrink: 0;
  }
</style>