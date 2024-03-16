# CSS Modules

## 什么是 CSS Modules？

顾名思义，css-modules 将 css 代码模块化，可以避免本模块样式被污染，并且可以很方便的复用 css 代码
根据 CSS Modules 在 Gihub 上的项目，它被解释为：
所有的类名和动画名称默认都有各自的作用域的 CSS 文件。

所以 CSS Modules 既不是官方标准，也不是浏览器的特性，而是在构建步骤（例如使用 Webpack，记住 css-loader）中对 CSS 类名和选择器限定作用域的一种方式（类似于命名空间）

依赖 webpack css-loader，配置如下，现在 webpack 已经默认开启 CSS modules 功能了

对应 style.css：

```css
.title {
  color: red;
}
```

打包工具会将 style.title 编译为带哈希的字符串
编译成 js 对象，因此需要引用`style.xxx`到 html 的 className 中

css 最后会被替换成响应的字符串

```html
<h1 class="_3zyde4l1yATCOkgn-DBWEL">Hello World</h1>
```

```css
._3zyde4l1yATCOkgn-DBWEL {
  color: red;
}
```

这样，就产生了独一无二的 class，解决了 CSS 模块化的问题
使用了 CSS Modules 后，就相当于给每个 class 名外加加了一个 :local，以此来实现样式的局部化，如果你想切换到全局模式，使用对应的 :global。
:local 与 :global 的区别是 CSS Modules 只会对 :local 块的 class 样式做 localIdentName 规则处理，:global 的样式编译后不变

```css
.title {
  color: red;
}
:global(.title) {
  color: green;
}
```

### 优点

- 能 100%解决 css 无作用域样式污染问题
- 学习成本低：API 简洁到几乎零学习成本

### 缺点

- 写法没有传统开发流程，如果你不想频繁的输入 styles.**，可以试一下 [react-css-modules](gajus/react-css-modules · GitHub)，它通过高阶函数的形式来避免重复输入 styles.**
- 没有变量，通常要结合预处理器（纯 css）
- 代码可读性差，hash 值不方便 debug
  css modules 通常结合 less 等预处理器在 react 中使用，更多可参考 CSS Modules 详解及 React 中实践
  https://zhuanlan.zhihu.com/p/20495964

## react-css-modules

利用高阶函数

https://github.com/gajus/react-css-modules

```html
<div className="global-css" styleName="local-module"></div>
```

```js
import React from "react";
import CSSModules from "react-css-modules";
import styles from "./table.css";

class Table extends React.Component {
  render() {
    return (
      <div styleName="table">
        <div styleName="row">
          <div styleName="cell">A0</div>
          <div styleName="cell">B0</div>
        </div>
      </div>
    );
  }
}

export default CSSModules(Table, styles);
```
