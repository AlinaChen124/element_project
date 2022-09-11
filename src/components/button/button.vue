<template>

    <button  
      class="y-button"
      :disabled = "disabled"
      :class="styleClass"
      @click="handleClick">
      <slot></slot>
    </button>
</template>

<script>
import { defineComponent,computed } from 'vue';
export default defineComponent({
  name: 'Button',
  props:{
    type:{
      type: String,
      default: "",
      validator: value => {
        return ["", "primary", "success", "warning", "danger"].includes(value);
      }
    },
    disabled:{
      type:Boolean,
      default:false
    },
    round:{// radius
      type:Boolean,
      default:false
    },
    icon:{
      type:String,
      default:""
    }
  },
  setup(props){
    const styleClass = computed(()=>{
      return {
        [`y-button--${props.type}`]: props.type,
        ["is-round"]: props.round,
        "is-disabled": props.disabled
      };
    })
    function handleClick(){
      alert("11");

    }
    return {
      handleClick,
      styleClass
    }
  }
})
</script>
  
  <style scoped lang="scss">
    @import "./styles.scss";
  </style>
