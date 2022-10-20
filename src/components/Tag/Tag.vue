<template>
  <span
    v-show="visible"
    :class="{
      ['tag']: true,
      ['tag-' + type]: type,
      ['tag-' + size]: size
    }"
    :style=" {backgroundColor:bgcolor,borderColor:bordercolor,color:color }"
    @click="click"
  >
    <slot></slot>
    <icon v-if="closable" name ="cross" @click="closeClick" class="icon-close"></icon>
  </span>
</template>

<script>
  import { defineComponent,ref } from 'vue'
  import Icon from '../Icon/icon.vue'
  export default defineComponent({
    name:'Tag',
    components:{
      Icon
    },
    props:{
      type: {
        type:String,
        default:''
      },
      closable:{
        type:Boolean,
        default:false
      },
      color: {
        type:String,
        default:''
      },
      bordercolor:{
        type:String,
        default:''
      },
      bgcolor:{
        type:String,
        default:''
      },
      size:{
        type:String,
        default:''
      } 
    },
    setup({emit}){
      const visible = ref(true)
      const closeClick = () => {
        visible.value = false
        emit('close')
      }
      const click = () => {
        emit('click')
      }
      return{
        visible,
        closeClick,
        click
      }
    }
  })
</script>
<style lang="scss">
@import './styles.scss';
</style>