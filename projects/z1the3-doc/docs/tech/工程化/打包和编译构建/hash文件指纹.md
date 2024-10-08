# hash（文件指纹）

hash 一般是结合 CDN 缓存来使用，通过 webpack 构建之后，生成对应文件名自动带上对应的 MD5 值。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的 HTML 引用的 URL 地址也会改变，触发 CDN 服务器从源服务器上拉取对应数据，进而更新本地缓存。但是在实际使用的时候，这几种 hash 计算还是有一定区别

## content-hash，与 hash、chunkhash 的区别

使用 contenthash 时，往往会增加一个小模块后，整体文件的 hash 都发生变化，原因为 Webpack 的 module.id 默认基于解析顺序自增，从而引发缓存失效。具体可通过设置 optimization.moduleIds 设置为 'deterministic' 。

### hash

hash 是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的 hash 值都会更改，并且全部文件都共用相同的 hash 值

所以 hash 计算是跟整个项目的构建相关，同一次构建过程中生成的哈希都是一样的

## chunkhash

采用 hash 计算的话，每一次构建后生成的哈希值都不一样，即使文件内容压根没有改变。这样子是没办法实现缓存效果，我们需要换另一种哈希值计算方式，即 chunkhash。

chunkhash 和 hash 不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用 chunkhash 的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响。

## contenthash

在 chunkhash 的例子，我们可以看到由于 index.css 被 index.js 引用了，所以共用相同的 chunkhash 值。但是这样子有个问题，如果 index.js 更改了代码，css 文件就算内容没有任何改变，由于是该模块发生了改变，导致 css 文件会重复构建。
这个时候，我们可以使用 extra-text-webpack-plugin 里的 contenthash 值，保证即使 css 文件所处的模块里就算其他文件内容改变，只要 css 文件内容不变，那么不会重复构建。

## 资源文件缓存策略

强缓存并设置超长过期时间 Cache-Controll: max-age=315360000
再通过文件指纹技术实现文件随内容变化

雪崩效应： 文件内容产生轻微变化，hashCode 要产生剧烈变化

格式 `main.f09e12.js`

CSS 中可以通过 MiniCssExtractPlugin 为 CSS 文件设置 hash

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MinCssExtractPlugin, "css-loader"],
      },
    ],
  },
  plugin: [
    new MiniCssExtractPlugin({
      filename: "[name][contenthash:hash].css",
    }),
  ],
};
```

图片文件也可以通过 file-loader 设置 hash

webpack 中的文件指纹策略一般分三种
全局、Chunk、文件（content?）
从大到小，根据需要选择

## 参考

https://www.cnblogs.com/ajaemp/p/12915452.html
https://webpack.docschina.org/guides/caching/
