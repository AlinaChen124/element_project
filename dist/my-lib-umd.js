! function (e, n) {
  "object" == typeof exports && "undefined" != typeof module ? n(exports, require("vue")) : "function" == typeof define && define.amd ? define(["exports", "vue"], n) : n((e = "undefined" != typeof globalThis ? globalThis : e || self).myLib = {}, e.vue)
}(this, (function (e, n) {
  "use strict";
  var t = n.defineComponent({
    setup: function () {
      return {
        click: function () {
          alert("11")
        }
      }
    }
  });
  t.render = function (e, t, o, l, c, u) {
    return n.openBlock(), n.createElementBlock("div", null, [n.createElementVNode("button", {
      onClick: t[0] || (t[0] = function () {
        return e.click && e.click.apply(e, arguments)
      }),
      class: "button"
    }, "保存")])
  }, t.__file = "src/components/button/button.vue", t.install = function (e) {
    e.component("MyButton", t)
  };
  var o = {
      methods: {
        onClick: function () {
          alert("11")
        }
      }
    },
    l = [n.createElementVNode("option", null, "苹果", -1), n.createElementVNode("option", null, "桃子", -1)];

  function c(e) {
    e.use(t), e.use(o)
  }
  o.render = function (e, t, o, c, u, i) {
    return n.openBlock(), n.createElementBlock("div", null, [n.createElementVNode("select", {
      onClick: t[0] || (t[0] = function () {
        return i.onClick && i.onClick.apply(i, arguments)
      })
    }, l)])
  }, o.__file = "src/components/select/select.vue", o.install = function (e) {
    e.component("MySelect", o)
  }, window && window.Vue && Vue.use(c), e.button = t, e.default = c, e.select = o, Object.defineProperty(e, "__esModule", {
    value: !0
  })
}));