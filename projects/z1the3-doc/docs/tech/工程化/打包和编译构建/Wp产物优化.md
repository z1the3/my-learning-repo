# Wp 产物优化

## tree shaking

Tree-shaking 是一种在构建过程中清除无用代码的技术。使用 Tree-shaking 可以减少构建后文件的体积。

## scope hoisting

目前 Webpack 与 Rollup 都支持 Scope Hoisting。它们可以检查 import 链，并尽可能的将散乱的模块放到一个函数中，前提是不能造成代码冗余。所以只有被引用了一次的模块才会被合并。使用 Scope Hoisting 可以让代码体积更小并且可以降低代码在运行时的内存开销，同时它的运行速度更快。前面 2.1 节介绍了变量从局部作用域到全局作用域的搜索过程越长执行速度越慢， Scope Hoisting 可以减少搜索时间。

## 分包

code-splitting 是 Webpack 中最引人注目的特性之一。此特性能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。code-splitting 可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

> https://juejin.cn/post/6844903639635623949

### 生产模式进行公共依赖包抽离
