import TableVue from './TableVue.vue'

TableVue.install = function (Vue) {
  Vue.component(TableVue.name, TableVue);
};

export default TableVue