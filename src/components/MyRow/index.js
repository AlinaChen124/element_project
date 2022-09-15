import MyRow from "./MyRow.vue";

MyRow.install = function (Vue) {
  Vue.component(MyRow.name, MyRow);
};

export default MyRow;