<template>
  <div
    :class="[selectClass,customClass]"
    :style="[
      customClass?{}:{ width:parseInt(width)<100?'100px':width}
    ]"
  >
  <div :class="selectInputClass" ref="selectRef" @click.prevent="selectOpen">
    <input 
      type="text" 
      readonly
      :style="[customClass?{}:customStyle]"
      :class="[selValue ==''?'select-input':'select-input-value']"
      :disabled = disabled
      :value="selValue"
      @input="input"
      :placeholder="selValue ==''?placeholder:selValue"
      >
    <Icon name="arrow-down" :style="[{transform:rotate},fixIcon]" :class="iconClass"></Icon>
  </div>
  <Transition name="slide-fade">
    <div class="select-option-box" v-if="optionShow">
      <div class="select-option-find">
        <ul>
          <li
            class="select-option-li"
            v-for="(item,index) in optionsData" 
            key="index" 
            @click="change(item,index)"
            :class="{
              'select-active':
              activeIndex==index||
              selValue == item[labelFiled]||item.selected,
              'select-disabled':item.disabled,
            }">{{item[labelFiled]}}
            <Icon name="success" v-if="multiple&&item.selected" class="icon"></Icon>
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</div>
</template>

<script>
import useClickOutside from '../../hooks/useClickOutside.js'
import Icon from '../Icon/icon.vue';
import { defineComponent,watch,ref, reactive,computed} from 'vue';
const optionShow = ref(false)
const selectRef = ref(null)
  const rotate = ref("rotate(0deg)")
  const activeIndex = ref(-1);
  export default defineComponent({
    name:"Select",
    emits:["update:modelValue"],
    components:{
      Icon
    },
    props:{
      placeholder:String,
      modelValue: String | Array,
      customClass:String,
      disabled: Boolean,
      multiple: Boolean,
      searchable:Boolean,
      options:{
        type:Array,
        default:()=>[]
      },
      //默认需要显示的label字段
      labelFiled: {
        type: String,
        default: "label",
      },
      //默认需要显示的value字段
      valueFiled: {
        type: String,
        default: "value",
      },
      size: {
        type: String,
        default: "default",
      },
      width: {
        type: String,
        default: "260px",
      },
      height: {
        type: String,
        default: "",
      },
    },
    setup(props,context){
      const optionsData = ref(props.options||[])
      const selValue = ref(
        props.multiple? props.modelValue:props.modelValue!=''?props.options.filter((item)=>{
          return item[props.valueFiled] == props.modelValue;
        })[0][props.labelFiled]:""
      )
      props.options.forEach((item,index)=>{
      if(!props.multiple){
        item.selected = false;
      }else{
        props.modelValue.forEach((item1,index1)=>{
          if(item[props.valueFiled]==item1){
            item.selected=true
          }
        })
      }
      })
      /* 1.增加选择框width和height属性的大小限制，高度最小是25px，width属性最小是100px
      2.动态计算下拉图标的行高 */
      const fixIcon = reactive({})
      // icon class
      const iconClass = computed(()=>{
        return ["select-icon"]
      })
      //根据自定义的组件尺寸适配组件里面的下拉框相对位置以及图标居中
      const customStyle = computed(() => {
        let styles = {};
        if (props.height) {
          let height = parseInt(props.height) < 25 ? "25px" : props.height;
          styles.height = height;
          fixIcon.lineHeight = height;
          fixIcon.top = 0;
          fixIcon.height = "100%";
        }
        return styles;
      });
      // select class
      const selectClass = computed(()=>{
        return [
          `select-${props.size}`,
          props.disabled? `select-${props.size}-disabled`:'',
        ]
      })
      // select input class
      const selectInputClass = computed(() => {
        return [
          "select-input-box",
          `select-input-${props.size}`,
          props.disabled ? `select-input-${props.size}-disabled` : "",
        ];
      });

    const selectOpen = ()=>{
      optionShow.value = !optionShow.value
      if(optionShow.value){
        rotate.value = 'rotate(180deg)'
      }else{
        rotate.value = 'rotate(0deg)'
      }
    }
    const isClickOutside = useClickOutside(selectRef)
    watch(isClickOutside,()=>{
      // 判断选项显示且在外点击
      if(optionShow.value&& isClickOutside.value){
        optionShow.value = false
        rotate.value = 'rotate(0deg)'
      }
    })
    const input = (e)=>{
      selValue.value = e.target.value;
      optionsData.value = [];
      let filterList = props.options.filter((item) => {
        return item[props.labelFiled].indexOf(e.target.value) != -1;
      });
      filterList.forEach((item, index) => {
        optionsData.value.push(item);
      });
    }

    let labels=[]
    let indexs=[]
    const change = (item,index)=>{
      if(!props.multiple){
        if(!props.disabled){
          activeIndex.value = index;
          selValue.value = item[props.labelFiled]
          context.emit("update:modelValue",item[props.valueFiled])
        }
      }else{
        if(!item.disabled){
          Array.prototype.indexOf = function (val) {
            for (var i = 0; i < this.length; i++) {
              if (this[i] == val) return i;
            }
            return -1;
          };
          item.selected = !item.selected
          if(item.selected){
            selValue.value.push(item[props.valueFiled])
            labels.push(item.label)
            indexs.push(item.index)
            console.log(props);
          }else{
            selValue.value.splice(selValue.value.indexOf(item[props.valueFiled]),1)
            labels.splice(labels.indexOf(item.label), 1);
            indexs.splice(indexs.indexOf(index), 1);
          }
          context.emit("update:modelValue",selValue.value)
          context.emit("change",{label:labels,value:valueFiled.value,index:indexs})
        }
      }
    }
    
    return{
      optionShow,
      optionsData,
      selectOpen,
      selectRef,
      selValue,
      activeIndex,
      input,
      change,
      rotate,
      iconClass,
      fixIcon,
      customStyle,
      selectClass,
      selectInputClass
    }
  }
})
</script>

<style lang="scss">
  @import "./styles.scss"
</style>