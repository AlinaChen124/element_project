import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import PluginVue from "rollup-plugin-vue";
import { terser } from "rollup-plugin-terser";
// 热更新
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: "./src/index.js",
  output: [
    { // es6模块
      file: "./dist/my-lib-es.js",
      format: "es",
    },
    { // commonjs模块
      file: "./dist/my-lib-cjs.js",
      format: "cjs",
    },
    {
      file: "./dist/my-lib-global.js",
      format: "iife",
      name: 'myLib',
      globals: {
        "vue": "Vue"
      }
    }
  ],
  plugins: [
    serve({
      contentBase: '',  //服务器启动的文件夹，默认是项目根目录，需要在该文件下创建index.html
      port: 8020   //端口号，默认10001
    }),    
    livereload('dist'),   //watch dist目录，当目录中的文件发生变化时，刷新页面
    PluginVue({
      name: 'Vue'
    }),
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true,
    }),
    commonjs(),
    postcss({
      plugins: [autoprefixer(), cssnano()],
      extract: `theme-chalk/index.css`,
    }),
    // terser(),
  ],
};