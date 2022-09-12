import { ref, onMounted, onUnmounted} from 'vue'
// 确定传入的参数，不仅要是一个dom节点，还得是一个响应式对象，大写的Ref代表的是一个类
const useClickOutside = (elementRef) => {
  // 创建一个变量，代表是否点击到元素外
  const isClickOutside = ref(false)
  // 回调函数
  const handler = (e) => {
    if (elementRef.value) {
      if (elementRef.value.contains(e.target)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isClickOutside
}

export default useClickOutside