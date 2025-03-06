# 配置图片 loader

在使用 Rspack（或类似的构建工具，如 Webpack）时，如果你尝试在项目中引用 .jpg 文件并遇到错误提示 You may need an appropriate loader to handle this file type，这通常意味着你需要配置一个合适的 loader 来处理图像文件。

## 1. 安装必要的 loader

安装 file-loader 或 url-loader

```
npm install file-loader --save-dev

```

如果希望图片经过处理后，最终作为小图像文件内联到 JavaScript 中，可以使用 url-loader

## 2. 配置 loader

test: 正则表达式，用于匹配需要处理的文件类型。在这里，我们匹配 .png、.jpg、.jpeg 和 .gif 文件。
use: 指定使用的 loader。在这里，我们使用 file-loader 或 url-loader。
options: 配置 loader 的选项。
name: 指定输出文件的命名规则。
limit: （仅在使用 url-loader 时）指定文件大小限制，小于此大小的文件将被转换为 base64 格式。

### file-loader

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
            },
          },
        ],
      },
    ],
  },
};
```

### url-loader

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192, // 如果文件小于8KB，则将其转换为base64格式
              name: "[path][name].[ext]",
            },
          },
        ],
      },
    ],
  },
};
```
