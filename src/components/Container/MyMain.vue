<template>
  <main class="my-main">
    <slot></slot>
  </main>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name:"MyMain"
})
</script>
<style lang="scss" scoped>
  .my-main{
    display: block;
    flex: 1;
    flex-basis: auto;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
  }
</style>