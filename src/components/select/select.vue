<template>
  <div class="y-select" ref="selectRef" @click.prevent="selectOpen">
    <input type="text" readonly :value="inputValue">
    <div class="y-option-box" v-if="optionShow">
      <li v-for="item in options" 
      key="options.label" @click="change(item)">{{item.value}}</li>
      
    </div>
  </div>
</template>

<script>
import useClickOutside from '../../hooks/useClickOutside.js'
import { defineComponent,watch,ref, onMounted} from 'vue';
const optionShow = ref(false)
const selectRef = ref(null)
const inputValue = ref("")
export default defineComponent({
  name:"Select",
  props:{
    options:{
      type:Array,
      default:()=>[]
    }
  },
  setup(props){
    const options = props.options
    const selectOpen = ()=>{
      optionShow.value = !optionShow.value
    }
    const isClickOutside = useClickOutside(selectRef)
    watch(isClickOutside,()=>{
      // 判断选项显示且在外点击
      if(optionShow.value&& isClickOutside.value){
        optionShow.value = false
      }
    })
    const change = (item)=>{
      inputValue.value = item.value
    }
    onMounted(() => {
      console.log(options);
    })
    return{
      optionShow,
      selectOpen,
      selectRef,
      options,
      inputValue,
      change
    }
  }
})
</script>

<style lang="scss" scoped>
  @import "./styles.scss"
</style>