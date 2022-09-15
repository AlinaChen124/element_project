import MyCol from "./MyCol.vue";

MyCol.install = function (Vue) {
  Vue.component(MyCol.name, MyCol);
};

export default MyCol;