<template>
  <label
    :class="{
      ['checkbox']: true,
      checked: checked,
      disabled: disabledOk
    }"
    @click="changeHandler"
    >
    <span>
      <span  class="checkbox-inner" :style="{border: checked?'1px solid #409EFF':'1px solid #DCDFE6'}">
        <icon name="check"       
        :class="checked?'icon-show':'icon-invisible'"
      ></icon>
      </span>
      <span v-if="$slots.default" class="checkbox-text"><slot></slot></span>
      <span v-else class="checkbox-text" v-text="label"></span>
    </span>
  </label>
</template>
<script>
import { defineComponent ,computed,onMounted,watch} from 'vue'
import Icon from '../Icon/icon.vue'
export default defineComponent({
  name:'CheckBox',
  components:{
    Icon
  },
  props:{
    disabled:{
      type:Boolean,
      default:false
    },
    label:String,
    modelValue:String | Boolean | Array,
    value:String,
    beforeChange:Function
  },
  setup(props,{emit}){
    const checked = computed(() => {
      // value为真时，当v-model=value时为选中状态
      // 否则，当v-model=true时为选中状态
      let bool
      if (props.value) {
        if (typeof props.modelValue === 'object') {
          bool = props.modelValue.indexOf(props.value) !== -1
        } else {
          bool = props.value === props.modelValue
        }
      } else {
        bool = !!props.modelValue
      }
      return bool
    })
    const controlChange = (val,type)=>{
      // 将组件值存起来，不触发其他操作，在没有手动触发时也使用validate来校验
      if (type === 'mounted') {
        return
      }
      if (type === 'change'){
        emit('change',val)
      }
    }
    const changeHandler = () => {
      if (props.beforeChange && !props.beforeChange()) {
        return
      }
      // 点击后只有选中状态
      if (props.disabled) {
        return
      }
      let val
      if (checked.value) {
        // 当前勾选状态，
        if (typeof props.modelValue === 'object') {
          // 删除当前项
          val = props.modelValue.filter((item) => {
            return item !== props.value
          })
        } else {
          val = false
        }
      } else {
        if (props.value) {
          if (typeof props.modelValue === 'object') {
            val = props.modelValue
            val.push(props.value)
          } else {
            val = props.value
          }
        } else {
          val = !props.modelValue
        }
      }
      emit('change', val)
      emit('update:modelValue', val)
      // controlChange && controlChange(val)
      controlChange(val, 'change')
    }
    watch(
      () => props.modelValue,
      (v) => {
        controlChange(props.modelValue, 'mounted')
        controlChange(v, 'mounted')
      }
    )
    onMounted(() => {
      // controlChange && controlChange(props.modelValue, 'mounted')
      controlChange(props.modelValue, 'mounted')
    })
    return {
      checked,
      changeHandler,
    }
  }
  
})
</script>
<style lang="scss">
@import './styles.scss';
</style>