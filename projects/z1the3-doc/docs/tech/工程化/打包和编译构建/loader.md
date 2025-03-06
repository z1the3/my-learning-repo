# Webpack 的 loader

## 常见 loader

- vue-loader
- ts-loader
- tsx-loader
- css-loader
  - 支持模块化，css 压缩和文件导入等
- style-loader
  - 将 css 代码注入到 js 上
- postcss-loader
  - 后处理器，处理 css 在不同浏览器的兼容性
- sass-loader
- less-loader
- file-loader 把文件输出到一个文件夹中，在代码中能通过相对 URL 引用
- url-loader(类似 file-loader,但是能在文件很小的情况下以 base64 的方式把文件内容直接注入到代码里去)
- image-loader(加载并压缩图片文件)
- source-map-loader(加载额外的 source-map 文件，以方便打点调试)
- babel-loader(ES6toES5)
- eslint-loader(通过 eslint 检查 js 代码，并进行修复？)

## url-loader 使用 base64 的好处

不用发送请求，可以直接嵌入到 html 中

虽然体积会大三分之一

使用 svg 体积不会增大，适用于颜色不复杂

## url-loader 快速转换 Base64

url-loader 允许你有条件地将文件转换为内联的 base-64 URL (当文件小于给定的阈值)，这会减少小文件的 HTTP 请求数。如果文件大于该阈值，会自动的交给 file-loader 处理

url-loader 会将引入的图片编码，生成 dataURl。相当于把图片数据翻译成一串字符。再把这串字符打包到文件中，最终只需要引入这个文件就能访问图片了。当然，如果图片较大，编码会消耗性能。因此 url-loader 提供了一个 limit 参数，小于 limit 字节的文件会被转为 DataURl，大于 limit 的还会使用 file-loader 进行 copy。

```json
{
    test: /.(jpg|jpeg|webp|png|svg|gif|woff|woff2|eot|ttf|otf)$/,
    exclude: /(node_modules|bower_components)/,
    use: [
        {
            loader: 'url-loader',
            options: {
                limit: 8192,
                name: '[path][name].[ext]',
            },
        },
    ],
}

```

```js
//通过url-loader快速转换base64
//是不是非常方便，只需一行代码搞定，这是把10kb以内的图片转成成base64
const testBase64 = require("!!url-loader?limit=10000!@/assets/images/test.png");
```

> https://juejin.cn/post/7000225935215558687

## style-loader css-loader

使用后会在 bundle.js 中注入其他 css 文件中那些的 css，而不会额外生成 css 文件

css-loader: 处理原 css 文件
style-loader: 将 css 的内容用 js 里的字符串存储起来，在网页执行 js 时通过 DOM 操作
动态地向 HTML head 标签里插入 HTML style 标签

缺点：导致 JS 文件变大，无法利用 css 缓存，加载网页时间变长

解决方法：利用 plugin 机制单独输出 css 文件

## loader 传参

- loader 的执行顺序是从后往前

- 每个 loader 都可以通过 URL querystring 的方式传入参数
  例如 css-loader?minimize 中的 minimize 告诉 css-loader 要开启 css 压缩

- 也可以通过对象形式配置

  ```js
  use: [
    "style-loader",
    {
      loader: "css-loader",
      options: {
        minimize: true,
      },
    },
  ];
  ```

- 也可以专门创建文件，在源码中指定用什么 loader 去处理文件（但是不便于统一管理）
  `require('style-loader!css-loader?minimize!./main.css')`

- 每个 官方 loader 的具体用法可以查阅 webpack 官方（https://github.com/webpack-contrib/css-loader）

## test exclude include

除了支持正则和字符串，还支持数组类型
这样不必使用正则表达“或”关系了

```js
test: [/\.jsx?$/, /\.tsx?$/],
include: [path.resolve(__dirname,'src'),path.resolve(__dirname,'tests')]

```
