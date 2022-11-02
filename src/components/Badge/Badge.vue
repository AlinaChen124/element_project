<template>
  <span :class="{'badge':true, dot:isDot, [type]:true}">
    <slot></slot>
    <sup>{{showValue}}</sup>
  </span>
</template>
<script>
import { defineComponent,computed } from 'vue';
export default defineComponent({
  name: 'Badge',
  props:{
    value:String|Number,
    dot:{
      type:Boolean,
      default:false
    },
    max:{
      type:Number,
      default:99
    },
    type:{
      type:String,
      default:'danger',
      validator: value => {
        return ["primary", "success", "warning", "danger"].includes(value);
      }
    }
  },
  setup(props){
    const showValue = computed(()=>{
      if(typeof props.value == 'number' && !isNaN(props.value) && props.value > props.max){
        return props.max + '+'
      }else{
        return props.value 
      }
    })
    // value有值，并dot为true时
    const isDot = computed(() => {
      return props.value && props.dot
    })
    return {
      showValue,
      isDot
    }
  }
})
</script>
<style lang="scss">
@import './styles.scss';
</style>