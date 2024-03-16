# BEM

Block\_\_Element--Modifier

## 简介

BEM 是一种 css 命名方法论，意思是块（Block）、元素（Element）、修饰符（Modifier）的简写
这种命名方法让 CSS 便于统一团队开发规范和方便维护
以 .block\_\_element--modifier 或者说 block-name\_\_element-name--modifier-name 形式命名，命名有含义，也就是模块名 + 元素名 + 修饰器名
如.dropdown-menu\_\_item--active
社区里面对 BEM 命名的褒贬不一，但是对其的思想基本上还是认同的，所以可以用它的思想，不一定要用它的命名方式

## 应用场景

BEM 思想通常用于组件库，业务代码中结合 less 等预处理器

## 优缺点分析

优点：

1. 人为严格遵守 BEM 规范，可以解决无作用域样式污染问题
2. 可读性好，一目了然是那个 dom 节点，对于无用 css 删除，删除了相应 dom 节点后，对应的 css 也能比较放心的删除，不会影响到其他元素样式

## 缺点

1. 命名太长（个人开发习惯、部分人会觉得，我认为命名长提高了可读性，能解决一些问题，也不叫缺点），至于体积增大，gzip 可忽略
   个人比较喜欢 BEM，其思想对编码好处远大于坏处，有兴趣的可以在项目中使用，更多可看知乎：如何看待 CSS 中 BEM 的命名方式？

https://www.zhihu.com/question/21935157
