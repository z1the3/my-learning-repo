# Webpack 配置

默认打包格式应该是 IFE

通过 format 可以配置输出 umd,cjs 还是 esm

## 配置 sourcemap

不同版本 webpack 不一样，需要看详细文档

```js
    optimization: {    // 1. 这个配置必须
        minimize: false
    },
    devtool: "source-map" // 2. 这个配置必须
```

## publicPath

会影响最后页面打包后标签上的路径

```
<link href="{publicPath}/xxx.js">
```

千万不要用相对路径，比如`./`

否则页面进入路由/a 后，资源会去`/a/xxx.js`下找

## externals

在 Webpack 中使用 externals 配置一个包时，该包不会被打包到最终的输出文件中，而是被视为外部依赖。因此，externals 配置的包本身不会有 hash 值，因为它不参与 Webpack 的打包过程。

由于 externals 的包不在打包范围内，Webpack 不会对其进行任何处理或生成 hash 值，因此它的内容变化不会影响 Webpack 输出文件的 hash 值。

防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。

例如，从 CDN 引入 jQuery，而不是把它打包
这样就剥离了那些不需要改动的依赖模块

## usedExports（treeshaking）

只要确保代码中使用的是 静态 import 即可开启

```js
module.exports = {
  optimization: {
    usedExports: true,
  },
};
```
