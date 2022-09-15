<template>

    <button  
      class="y-button"
      :disabled = "disabled"
      :text = "text"
      :class="styleClass"
      @click="handleClick">
      <span class="icon" v-if="icon">
        <Icon :name="icon"></Icon>
      </span>
      <slot></slot>
    </button>
</template>

<script>
import { defineComponent,computed,onMounted } from 'vue';
import Icon from '../Icon/icon.vue'
export default defineComponent({
  name: 'Button',
  components:{
    Icon
  },
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
    text:{
      type:Boolean,
      default:false
    },
    icon:{
      type:String,
      default:""
    }
  },
  setup(props,context){
    const styleClass = computed(()=>{
      return {
        [`y-button--${props.type}`]: props.type,
        ["is-round"]: props.round,
        "is-disabled": props.disabled,
        "is-text":props.text
      };
    })
    function handleClick(){
      // alert("11");
      context.emit('click')
    }
    onMounted(() => {
      console.log(context.slots.default);
    })
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

  

