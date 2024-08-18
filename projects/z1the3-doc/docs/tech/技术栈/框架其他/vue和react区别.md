# Vue 和 React 区别

## 共同点

1. 数据驱动视图。
2. 组件化。
3. 都使用 Virtual DOM + Diff 算法。

## 不同点

### 1.响应式原理

vue 依赖收集，自动优化，**数据可变**
当数据发生改变时，自动找到引用组件重新渲染。

React 基于状态机，手动优化，数据不可变
当数据改变时，以该组件为根节点，默认全部重新渲染，所以 React 中会需要 shouldComponentUpdate 这个生命周期函数方法来进行控制。

### 2.组件写法

React 推荐的是 JSX + inline style，也就是把 HTML 和 CSS 全部写进 JavaScript 中，即 all in js；

Vue 推荐的是 template 的单文件组件格式（简单易懂，从传统前端转过来易于理解），即 html,css，js 都写在同一个文件里（Vue 也是支持 JSX 写法的）。

### 3.diff 算法

Vue 的列表对比，采用的是两端到中间对比的方式，而 React 采用的是从左到右依次对比的方式。
当一个集合只是把最后一个节点移到了第一个，React 会把前面的节点依次移动，而 Vue 只会把最后一个节点移到第一个。总体来说，Vue 的方式比较高效。

### 4.原理

Vue 为 MVVM 模型
React 为 UI 即函数

Vue 默认支持双向数据流
React 默认只支持单向数据流，且数据不可变
现在都推崇函数式编程

> 引用
> https://segmentfault.com/a/1190000043407709
