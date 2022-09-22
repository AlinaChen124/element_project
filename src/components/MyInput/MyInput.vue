<template>
  <div  >
    <div :class="isClass" :style="isStyle">
      <Icon :name="lefticon"
      :class="['left-icon']" 
      v-if="!showPassword&&lefticon!=''"
      ></Icon>
      <input :type="inputType" 
      :value="modelValue" 
      @input="input" 
      :disabled="disabled" 
      :placeholder="placeholder"
      @focus="focus"
      @blur="blur"
      :readonly="readonly"
      :form="form"
      >
      <Transition name="slide-fade">
        <Icon class="clearable-icon" name="cross" v-if="!showPassword&&clearable&&modelValue!=''" @click="clear"></Icon>
      </Transition>
      <Icon :name="righticon"
      :class="['right-icon']" 
      v-if="!showPassword&&rigthIcon!=''"
      ></Icon>
    </div>
  </div>
</template>
<script>

import { defineComponent ,computed, ref,onMounted} from 'vue'
import Icon from '../Icon/icon.vue'
export default defineComponent({
    emits: ["update:modelValue", "focus","clear","blur","input"],
    name: "MyInput",
    components:{
      Icon
    },
    props: {
      modelValue: String | Number,
      disabled: Boolean,
      placeholder: String,
      clearable:Boolean,
      readonly:Boolean,
      form:String,
      type: {
          type: String,
          default: "text"
      },
      size:{
        type:String,
        default:'default'
      },
      focuscolor: {
          type: String,
          default: "#0e80eb"
      },
      lefticon:{
        type: String,
        default:''
      },
      righticon:{
        type:String,
        default:""
      }
    },
    setup(props, context) {
        const inputType = ref(props.type);
        const isStyle = ref({});
        const input = (e) => {
            context.emit("update:modelValue", e.target.value);
        };
        const isClass = computed(() => {
            return [
              props.lefticon!=''?`input-left-icon-${props.size}`:!props.clearable?props.righticon!=''?`input-right-icon-${props.size}`:'':'',
              props.clearable? 'input-clearable':props.size == 'default'?'input-default':`input-${props.size}`,
              props.disabled ? "input-disabled" : "",
            ];
        });
        const clear = (e)=>{
          context.emit('update:modelValue',"")
          context.emit('clear')
        }
        let focusStyle = {
            "width": "100%",
            "border-radius": "4px",
            "border": "1px solid #dcdfe6f6"
        };
        isStyle.value = focusStyle;
        const focus = (e) => {
            // console.log('focus');
            console.log(props.focuscolor);
            focusStyle["border"] = `1px solid ${props.focuscolor}`;
            isStyle.value = {
                "width": "100%",
                "border-radius": "4px",
                "border": `1px solid ${props.focuscolor}`
            };
            context.emit("focus", e);
        };
        const blur = (e) => {
            isStyle.value = {
                "width": "100%",
                "border-radius": "4px",
                "border": "1px solid #dcdfe6f6"
            };
        };
        onMounted(() => {
            // console.log(props.focuscolor);
        });
        return {
            input,
            isClass,
            inputType,
            isStyle,
            focus,
            blur,
            clear
        };
    },
    components: { Icon }
})
</script>
<style lang="scss">
@import './styles.scss'
</style>