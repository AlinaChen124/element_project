
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('core-js/modules/es.function.name.js');
var vue = require('vue');

var script$1 = vue.defineComponent({
  name: 'Button',
  setup: function setup() {
    function click() {
      alert("11");
    }

    return {
      click: click
    };
  }
});

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", null, [vue.createElementVNode("button", {
    onClick: _cache[0] || (_cache[0] = function () {
      return _ctx.click && _ctx.click.apply(_ctx, arguments);
    }),
    class: "button"
  }, "保存")]);
}

script$1.render = render$1;
script$1.__file = "src/components/Button/Button.vue";

script$1.install = function (Vue) {
  Vue.component(script$1.name, script$1);
};

var script = {
  methods: {
    onClick: function onClick() {
      alert("11");
    }
  }
};

var _hoisted_1 = /*#__PURE__*/vue.createElementVNode("option", null, "苹果", -1
/* HOISTED */
);

var _hoisted_2 = /*#__PURE__*/vue.createElementVNode("option", null, "桃子", -1
/* HOISTED */
);

var _hoisted_3 = [_hoisted_1, _hoisted_2];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", null, [vue.createElementVNode("select", {
    onClick: _cache[0] || (_cache[0] = function () {
      return $options.onClick && $options.onClick.apply($options, arguments);
    })
  }, _hoisted_3)]);
}

script.render = render;
script.__file = "src/components/select/select.vue";

script.install = function (Vue) {
  Vue.component("MySelect", script);
};

exports.Button = script$1;
exports.select = script;
