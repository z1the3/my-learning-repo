# rollup

```js
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import camelCase from "lodash.camelcase";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";

const pkg = require("./package.json");

const libraryName = "axios";

export default {
  // 可以`src/${libraryName}.ts`
  // 打包的入口文件
  input: `src/index.ts`,
  // 打包输出文件
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: "umd",
      sourcemap: true,
    },
    { file: pkg.module, format: "es", sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  // 不需要的外部依赖
  external: [],
  // 可以去监听文件变化,变化后就会重新编译
  watch: {
    include: "src/**",
  },
  // 堆plugin
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
};
```

对于应用使用 webpack，对于类库使用 Rollup
这不是一个绝对的规则 – 事实上有许多 网站 和 应用程序使用 Rollup 构建，同样的也有大量的库使用了 webpack 构建。但是，
对于应用使用 webpack，对于类库使用 Rollup
是一个很好的经验法则。

如果你需要代码拆分(Code Splitting)，或者你有很多静态资源需要处理，再或者你构建的项目需要引入很多 CommonJS 模块的依赖，那么 webpack 是个很不错的选择。如果您的代码库是基于 ES2015 模块的，而且希望你写的代码能够被其他人直接使用，你需要的打包工具可能是 Rollup

### package.json

```json
{
  "name": "ts-axios",
  "version": "0.0.0",
  "description": "",
  "keywords": [],
    路径名改成rollup打包结果
  "main": "dist/axios.umd.js",
  "module": "dist/axios.es5.js",
  "typings": "dist/types/axios.d.ts",
  "files": [
    "dist"
  ],
}
```
