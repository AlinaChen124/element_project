<script>
import {defineComponent,h} from 'vue';
export default defineComponent({
  name:'HeaderSlot',
  props:{
    data:Object,
    index:Number
  },
  setup(props){
    if(props.data.slots&&props.data.slots.header){
      return ()=>[
        // 使用数组返回多个节点
        h(
          'span',// type
          {},// props
          props.data.slots.header({
            column:props.data,
            index:props.index
          })
        )
      ]
    }else{
      return ()=>[]
    }
  }
})
</script>