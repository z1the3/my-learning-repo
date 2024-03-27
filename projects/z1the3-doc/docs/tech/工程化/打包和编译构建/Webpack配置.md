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
