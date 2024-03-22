# React

## 受控组件和非受控组件

受控组件基本概念
通过名称，我们可以猜测一下这两个词是什么意思：

受控组件：受我们控制的组件
非控组件：不受我们控制的组件

也就是我们对某个组件状态的掌控，它的值是否只能由用户设置，而不能通过代码控制。

### 非控组

我们知道，在 React 中定义了一个 input 输入框的话，它并没有类似于 Vue 里 v-model 的这种双向绑定功能。也就是说，我们并没有一个指令能够将数据和输入框结合起来，用户在输入框中输入内容，然后数据同步更新。

### 受控组件

在 HTML 的表单元素中，它们通常自己维护一套 state，并随着用户的输入自己进行 UI 上的更新，这种行为是不被我们程序所管控的。而如果将 React 里的 state 属性和表单元素的值建立依赖关系，再通过 onChange 事件与 setState()结合更新 state 属性，就能达到控制用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做受控组件

## 缓存优化 memo

pureComponent shouldComponentUpdate React.memo

前两个供类组件使用，React.memo 供函数式组件使用，是一个高阶组件，通过包裹函数返回一个新组件
浅比较 props 不改变则不重新渲染

pureComponent 即将 shouldComponentUpdate 设定为浅比较 props 的父组件

## React 18 新特性

### Concurrent Rendering 并发渲染

Concurrency 是 React 18 的关键词，可以理解成是一种背后的机制，保证 React 能够同时准备多套 UI。

具体到表现上区别于以往的最大的特点就是渲染是可中断的。

这意味着当你的应用正在进行复杂更新的时候，仍然可以与页面进行交互，保证一个流畅的用户体验。

既然是一种背后的机制，实际上开发者并非需要先学习并发渲染才能使用 React18，但是能够掌握并发渲染对于新特性的理解有非常大的作用。

核心实现是通过组件作为一个基本的工作单元将一个大的更新任务进行拆分，然后以时间切片的方式，分布在不同的时间片来执行，每个时间片执行完成后都会主动释放控制权，使得浏览器能够处理其它用户事件。而具体时间片上执行哪个任务是由任务上的相关优先级决定的，当高优先级的更新到来时，会中断旧的更新，优先执行高优先级更新，待完成后继续执行低优先级更新。

### Auto Batching

首先批处理是指 React 将多次状态更新合并成一次重渲染来提升性能
早在 16 的版本中其实就已经包含了批处理能力，如下面的例子：

```js
setCount((c) => c + 1); // Does not re-render yet
setFlag((f) => !f);
```

然而如果更新发生在**timeouts, promises, native event handlers 等非 React events 事件**中，React 18 之前的版本默认都不会进行合并

在 18 之前，由于更新会同步执行，因此我们能够获得中间状态。然而在 18 中，即使是 setTimeout 中的更新也会自动合并，并在 next tick 中合并执行，打印的状态为初始化状态，从而前后不一致。

React 18 所有的更新都变为一次更新。

针对这种情况，我们可以使用 React 18 中提供的 ReactDOM.flushSync 来保持向前兼容。（为了使用中间状态）

```js
handleClick = () => {
  setTimeout(() => {
    // 未及时渲染的更新不会被合并掉
    ReactDOM.flushSync(() => {
      this.setState(({ count }) => ({ count: count + 1 }));
    });

    // { count: 1, flag: false }
    console.log(this.state);

    this.setState(({ flag }) => ({ flag: !flag }));
  });
};
```
