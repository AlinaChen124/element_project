import {
  defineComponent as n,
  openBlock as t,
  createElementBlock as e,
  createElementVNode as o
} from "vue";
var u = n({
  setup: function () {
    return {
      click: function () {
        alert("11")
      }
    }
  }
});
u.render = function (n, u, c, l, i, r) {
  return t(), e("div", null, [o("button", {
    onClick: u[0] || (u[0] = function () {
      return n.click && n.click.apply(n, arguments)
    }),
    class: "button"
  }, "保存")])
}, u.__file = "src/components/button/button.vue", u.install = function (n) {
  n.component("MyButton", u)
};
var c = {
    methods: {
      onClick: function () {
        alert("11")
      }
    }
  },
  l = [o("option", null, "苹果", -1), o("option", null, "桃子", -1)];

function i(n) {
  n.use(u), n.use(c)
}
c.render = function (n, u, c, i, r, s) {
  return t(), e("div", null, [o("select", {
    onClick: u[0] || (u[0] = function () {
      return s.onClick && s.onClick.apply(s, arguments)
    })
  }, l)])
}, c.__file = "src/components/select/select.vue", c.install = function (n) {
  n.component("MySelect", c)
}, window && window.Vue && Vue.use(i);
export {
  u as button, i as
  default, c as select
};