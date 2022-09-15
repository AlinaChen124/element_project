import MyAside from './MyAside.vue'
import MyContainer from './MyContainer.vue'
import MyFooter from './MyFooter.vue'
import MyHeader from './MyHeader.vue'
import MyMain from './MyMain.vue'

MyAside.install = function (Vue) {
  Vue.component(MyAside.name, MyAside);
};

MyContainer.install = function (Vue) {
  Vue.component(MyContainer.name, MyContainer);
};

MyFooter.install = function (Vue) {
  Vue.component(MyFooter.name, MyFooter);
};

MyHeader.install = function (Vue) {
  Vue.component(MyHeader.name, MyHeader);
};

MyMain.install = function (Vue) {
  Vue.component(MyMain.name, MyMain);
};

export {
  MyAside,
  MyContainer,
  MyFooter,
  MyHeader,
  MyMain
}