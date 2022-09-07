<template>
  <div>
    <button @click="click" class="button">保存</button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  setup(){
    function click(){
      alert("11");
    }
    return {
      click,
    }
  }
})
</script>
  
  <style>
  .button {
    background-color: blue;
  }
  </style>