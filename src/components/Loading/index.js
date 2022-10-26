import Loading from './Loading.vue';
import { createApp } from 'vue'

const appendChild = (opt) => {
  const app = createApp(Loading, opt)
  if (opt.el === document.body || !opt.el) {
    const container = document.createElement('div')
    document.body.appendChild(container)
    return app.mount(container)
  } else {
    // 插入到当前标签
    return app.mount(opt.el)
  }
}
const loading = (opt) => {
  const component= appendChild(opt || {})
  component && component.open()
  return component
}

const vLoading = (app) => {
  app.directive('loading', {
    mounted(el, binding) {
      console.log(binding);
      el.style.position = 'relative'
      const text = el.getAttribute(`loading-text`) || ''
      const spinner = el.getAttribute(`loading-spinner`) || ''
      const background =
        el.getAttribute(`loading-background`) || ''
      const zIndex = el.getAttribute(`loading-zIndex`) || ''
      let bodyEl
      if (binding.modifiers.el) {
        // 插入到body
        bodyEl = document.body
      }
      const component = appendChild({
        text: text,
        spinner: spinner,
        background: background,
        lock: binding.modifiers.lock,
        zIndex: parseInt(zIndex),
        el: bodyEl || el
      })
      console.log('component')
      console.log(component)
      if (binding.value) {
        component && component.open()
      }
      el.component = component // 保存当前组件和样式，更新时调用
    },
    updated(el, binding) {
      if (binding.value) {
        el.component.open()
      } else {
        el.component.close()
      }
    }
  })
}
export { loading, vLoading }