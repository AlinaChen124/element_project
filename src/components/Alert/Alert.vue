<template>
  <transition name="alert-fade">
    <div
     v-show="visible"
     :class="{
      ['alert']: true,
      ['alert-' + type]: type,
      ['is-center']: center,
      ['alert-' + effect]:effect
    }"
    >
      <icon
        v-if="showIcon && iconComponent"
        :name="iconComponent"
        :class="iconClass"
      ></icon>
      <div class="alert-content">
        <span v-if="title|| $slots.title" :class="['alert-title',isBoldTitle]">
          <slot name="title">{{title}}</slot>
        </span>
        <p v-if="$slots.default||description" :class="'alert-description'">
          <slot>{{description}}</slot>
        </p>
      </div>
      <template v-if="closable">
        <div
          v-if="closeText"
          :class="['close-btn']"
          @click="close"
        >
          {{closeText}}
        </div>
        <icon v-else name="cross" @click="close" class="close-btn"></icon>
      </template>
    </div>
  </transition>
</template>
<script>
import { defineComponent , useSlots ,ref,computed} from 'vue'
import {TypeComponentsMap} from './icon'
import Icon from '../Icon/icon.vue'
export default defineComponent({
  name:'Alert',
  components:{
    Icon,
    Icon
},
  props:{
    title:{
      type:String,
      default:'',
    },
    description:{
      type:String,
      default:''
    },
    type:{
      type:String,
      default:'info',
      validator: value => {
        return ["info", "success", "warning", "error"].includes(value);
      }
    },
    closable:{
      type:Boolean,
      default:true
    },
    closeText:{
      type:String,
      default:''
    },
    showIcon:Boolean,
    center:Boolean,
    effect:{
      type:String,
      values:['light','dark'],
      default:'light'
    }
  },
  setup(props,{emit}){
    const slots = useSlots()
    const visible = ref(true)
    const iconComponent = computed(()=>TypeComponentsMap[props.type])
    const iconClass = computed(()=>['icon',{['is-big']:!!props.description||!!slots.default}])
    const isBoldTitle = computed(()=>{return {['is-bold']:props.description||slots.default}})
    const close = (evt)=>{
      visible.value = false
      emit('close',evt)
    }
    return {
      slots,
      visible,
      iconComponent,
      iconClass,
      isBoldTitle,
      close
    }
  }
})
</script>
<style lang="scss">
@import './styles.scss';
</style>