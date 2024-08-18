# css in js

CSS in JS 是 2014 年推出的一种设计模式，它的核心思想是把 CSS 直接写到各自组件中，也就是说用 JS 去写 CSS，而不是单独的样式文件里

这跟传统的前端开发思维不一样，传统的原则是关注点分离，如常说的不写行内样式、不写行内脚本

CSS-in-JS 不是一种很新的技术，可是它在国内普及度好像并不是很高，它当初的出现是因为一些 component-based 的 Web 框架（例如 React，Vue 和 Angular）的逐渐流行，使得开发者也想将组件的 CSS 样式也一块封装到组件中去以解决原生 CSS 写法的一系列问题

> CSS-in-JS 在 React 社区的热度是最高的，这是因为 React 本身不会管用户怎么去为组件定义样式的问题，而
> Vue 和 Angular 都有属于框架自己的一套定义样式的方案

代码在一个文件里面，封装了结构、样式和逻辑，完全违背了"关注点分离"的原则
但是，这有利于组件的隔离。每个组件包含了所有需要用到的代码，不依赖外部，组件之间没有耦合，很方便复用。所以，随着 React 的走红和组件模式深入人心，这种"关注点混合"的新写法逐渐成为主流

## 目前支持

- 唯一 CSS 选择器
- 内联样式（Unique Selector VS Inline Styles）
  不同的 CSS in JS 实现除了生成的 CSS 样式和编写语法有所区别外，它们实现的功能也不尽相同，除了一些最基本的诸如 CSS 局部作用域的功能，下面这些功能有的实现会包含而有的却不支持：
- 自动生成浏览器引擎前缀 - built-in vendor prefix
- 支持抽取独立的 CSS 样式表 - extract css file
- 自带支持动画 - built-in support for animations
- 伪类 - pseudo classes
- 媒体查询 - media query
- 其他

## CSS in JS 与"CSS 预处理器"（比如 Less 和 Sass，包括 PostCSS）有什么区别

CSS in JS 使用 JavaScript 的语法，是 JavaScript 脚本的一部分，不用从头学习一套专用的 API，也不会多一道编译步骤，但是通常会在运行时动态生成 CSS，造成一定运行时开销

## 优缺点分析

优点

- 没有无作用域问题样式污染问题
- 通过唯一 CSS 选择器或者行内样式解决
- 没有无用的 CSS 样式堆积问题
- CSS-in-JS 会把样式和组件绑定在一起，当这个组件要被删除掉的时候，直接把这些代码删除掉就好了，不用担心删掉的样式代码会对项目的其他组件样式产生影响。而且由于 CSS 是写在 JavaScript 里面的，我们还可以利用 JS 显式的变量定义，模块引用等语言特性来追踪样式的使用情况，这大大方便了我们对样式代码的更改或者重构
- 更好的基于状态的样式定义
- CSS-in-JS 会直接将 CSS 样式写在 JS 文件里面，所以样式复用以及逻辑判断都十分方便

## 缺点

- 一定的学习成本
- 代码可读性差
- 大多数 CSS-in-JS 实现会通过生成唯一的 CSS 选择器来达到 CSS 局部作用域的效果。这些自动生成的选择器会大大降低代码的可读性，给开发人员 debug 造成一定的影响
- **运行时消耗**
- 由于大多数的 CSS-in-JS 的库都是在动态生成 CSS 的。这会有两方面的影响。

  首屏加载速度+性能，首先你发送到客户端的代码会包括使用到的 CSS-in-JS 运行时（runtime）代码，这些代码一般都不是很小，例如 styled-components 的 runtime 大小是 12.42kB min + gzip，如果你希望你首屏加载的代码很小，你得考虑这个问题。其次大多数 CSS-in-JS 实现都是在客户端动态生成 CSS 的，这就意味着会有一定的性能代价。不同的 CSS-in-JS 实现由于具体的实现细节不一样，所以它们的性能也会有很大的区别，你可以通过这个工具来查看和衡量各个实现的性能差异

- 不能结合成熟的 CSS 预处理器（或后处理器）Sass/Less/PostCSS，:hover 和 :active 伪类处理起来复杂

https://zhuanlan.zhihu.com/p/103522819
https://www.ruanyifeng.com/blog/2017/04/css_in_js.html

## emotion css vs styled components

Emotion CSS 和 Styled Components 都是在 React 应用中使用的 CSS-in-JS 库，它们提供了一种使用 JavaScript 编写 CSS 样式的方式，从而可以更好地管理和维护 CSS 代码。以下是它们之间的区别：

### 语法

Emotion CSS 使用 css 函数配合模版字符串，而 css 函数写在标签内联样式中。而 Styled Components 使用一种类似于 JavaScript 的语法，可以在 JavaScript 中直接编写 CSS 样式（模版字符串，无语法高亮）。
