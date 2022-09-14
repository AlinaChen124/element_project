<template>
<div :class="className" ref="row">
  <slot></slot>
</div>
</template>
<script>
import { defineComponent,computed,getCurrentInstance,onMounted } from 'vue'
export default defineComponent({
  name:"row",
  props:{
    gutter:{//分栏间隔
      type:[Number,String],
      default:0
    },
    type:{//布局方式
      type:String,
      default:"",
      validator:function(value){
        return ["","flex"].indexOf(value)!==-1
      }
    },
    justify:{//flex下的水平排列方式
      type:String,
      default:"center",
      validator:function(value){
        return (
          ["start","end","center","space-around","space-between"].indexOf(value)!==-1
        )
      }
    },
    align:{//flex下的垂直排列方式
      type:String,
      default:"middle",
      validator:function(value){
        return ["top","middle","bottom"].indexOf(value)!==-1
      }
    }
  },
  setup(props){
    // 设置类名
    const className = computed(()=>{
      const isFlex = props.type === "flex"
      const prefix = isFlex?"bp-row-flex":"bp-row"
      const name = [prefix]
      if(isFlex){
        name.push(`bp-row-flex-justify-${props.justify}`)
        name.push(`bp-row-flex-align-${props.align}`)
      }
      return name
    })
    // 设置col属性
    const setColAttrs = ()=>{
      // 获取row下所有col
      // getCurrentInstance()用于获取当前组件实例
      const row = getCurrentInstance().refs.row.children||[]
      let len = row.length
      if(len ==0) return
      for(let i = 0;i<len;i++){
        // 布局模式
        row[i].classList.add("bp-col")
        // Gutter处理
        if(props.gutter!==0&&len>1){
          if(i!==0){
            row[i].style.paddingLeft = `${props.gutter}px`;
          }
          if(i!==len-1){
            row[i].style.paddingRight = `${props.gutter}px`
          }
        }
      }
    }
    onMounted(() => {
      setColAttrs()
    })
    return {
      className
    }
  }
})
</script>
<style lang="scss" scoped>
@import "./style.scss"
</style>