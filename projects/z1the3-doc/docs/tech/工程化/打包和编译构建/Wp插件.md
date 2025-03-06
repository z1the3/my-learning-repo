# Webpack 插件

啥是 plugin?
将自己的逻辑融入到 Webpack 的构建流程中，实现一系列功能（打包优化，资源管理，注入环境变量）

plugin 广泛地来说不针对特定的模块，具体的 plugin 可能专门为某类模块的负责
webpack 通过 plugins 属性来配置使用的插件列表
plugins 属性是一个数组，里面每一项都是插件的一个实例

```js
// 需要实例化
plugins: [
  new ExtractTextPlugin.extract({
    // 配置输出单独css文件的名称
    filename: `[name]_[contenthash:8].css`,
  }),
];
```

## 常用

### 全局

- CleanWebpackPlugin 用于在每次构建前清理 dist 输出目录
- CompressionWebpackPlugin 用于对打包后的资源文件进行 gzip 压缩

### HTML

HtmlWebpackPlugin 用于生成 HTML 文件，并将打包后的资源文件自动引入

### CSS

MiniCssExtractPlugin 用于将 CSS 提取为单独的文件
CSS 中可以通过 MiniCssExtractPlugin 为 CSS 文件设置 hash

这里提取并设置 hash 好处在于

- 把大文件分成小文件做请求，可以多路复用
- 对小文件选择性缓存，而不是大文件一次改动就破坏掉了曾经的缓存

### JS

DefinePlugin 用于定义环境变量
UglifyJsPlugin 用于压缩 JS 代码，不支持 ES6 以上
TerserWebpackPlugin 压缩和混淆 js 代码，支持 ES6 以上

### 静态资源图片

CopyWebpackPlugin 用于将静态文件直接复制到输出目录

### 调试分析

webpack-bundle-analyzer 用于分析并可视化打包后的模块大小和依赖关系
FriendlyErrorsWebpackPlugin 用于友好地展示 Webpack 构建错误信息
HotModuleReplacementPlugin 用于实现热模块替换功能

### 写一个 webpack 插件,禁用某函数

写一个禁用 Object.assign()的 plugin？

自己写一个 plugin，首先要满足一个框架：

1. 是一个类
2. 在 apply 方法下实现功能，apply 方法接收第一个参数是 compiler 对象

```js
class ObjectAssignPlugin {

  // complier-> compliation -> module -> call(调用函数的钩子)
   apply(compiler) {
      compiler.hooks.compilation.tap('ObjectAssignPlugin', (compilation) => {
        compilation.hooks.buildModule.tap('ObjectAssignPlugin', (module) => {
          // console.log(module)
          module.parser.hooks.call.for('Object.assign').tap('ObjectAssignPlugin', () => {
            throw new Error(`Error: Object.assign is not allowed!`);
          });
        });
      });
    }
}
module.exports = ObjectAssignPlugin
其中使用compilation的buildModule钩子，以此介入编译过程，在parser遇到Object.assign方法时抛出错误。

```
