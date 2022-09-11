
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import 'core-js/modules/es.function.name.js';
import 'core-js/modules/es.array.includes.js';
import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, renderSlot, createElementVNode } from 'vue';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var script$1 = defineComponent({
  name: 'Button',
  props: {
    type: {
      type: String,
      default: "",
      validator: function validator(value) {
        return ["", "primary", "success", "warning", "danger"].includes(value);
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    round: {
      // radius
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ""
    }
  },
  setup: function setup(props) {
    var styleClass = computed(function () {
      var _ref;

      return _ref = {}, _defineProperty(_ref, "y-button--".concat(props.type), props.type), _defineProperty(_ref, "is-round", props.round), _defineProperty(_ref, "is-disabled", props.disabled), _ref;
    });

    function handleClick() {
      alert("11");
    }

    return {
      handleClick: handleClick,
      styleClass: styleClass
    };
  }
});

var _hoisted_1$1 = ["disabled"];
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", {
    class: normalizeClass(["y-button", _ctx.styleClass]),
    disabled: _ctx.disabled,
    onClick: _cache[0] || (_cache[0] = function () {
      return _ctx.handleClick && _ctx.handleClick.apply(_ctx, arguments);
    })
  }, [renderSlot(_ctx.$slots, "default")], 10
  /* CLASS, PROPS */
  , _hoisted_1$1);
}

script$1.render = render$1;
script$1.__scopeId = "data-v-4439b54f";
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

var _hoisted_1 = /*#__PURE__*/createElementVNode("option", null, "苹果", -1
/* HOISTED */
);

var _hoisted_2 = /*#__PURE__*/createElementVNode("option", null, "桃子", -1
/* HOISTED */
);

var _hoisted_3 = [_hoisted_1, _hoisted_2];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [createElementVNode("select", {
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

export { script$1 as Button, script as select };
