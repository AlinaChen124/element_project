<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script>
import '../../asset/js/iconfont'
import { defineComponent,computed } from 'vue';
export default defineComponent({
  name:"Icon",
  props:{
    name:{
      type:String,
      default:""
    }
  },
  setup(props){
    const iconName = computed(()=>{
      return `#icon-${props.name}`
    })
    return {
      iconName
    }
  }
})
</script>
<style type="text/css">
  .icon {
     width: 1em; 
     height: 1em;
     vertical-align: -0.15em;
     fill: currentColor;
     overflow: hidden;
     line-height:1em;
     display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-size: inherit;
  }
</style>