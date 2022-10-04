import MyMenu from './MyMenu.vue'
import MenuItem from './MenuItem.vue'

MyMenu.install = function (Vue) {
  Vue.component(MyMenu.name, MyMenu);
};

MenuItem.install = function (Vue) {
  Vue.component(MenuItem.name, MenuItem);
};

export {
  MyMenu,
  MenuItem
}