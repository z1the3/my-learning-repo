# sourcemap

sourcemap 是编译后代码和原始代码的映射
默认会对变量等进行压缩处理
比如`const apple = 1` 在 bundle 中为`const a = 1`

```js
// 代码行号，文件名
apple -> a;
```

## 作用

通过 sourceMap 可以用浏览器调试代码

在项目打包过程后，sourceMap 会放在异常监控服务器

发生异常后，异常包括异常内容和异常位置会上报到监控服务器

服务器再通过 sourceMap 解析出线上发生错误的真正位置

## 安全性问题

因为 bundle+sourceMap = 源代码

所以 sourceMap 并不会和 bundle 放在一起
