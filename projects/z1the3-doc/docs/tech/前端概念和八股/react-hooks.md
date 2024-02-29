# React Hooks

## 对函数式编程思想的理解

https://blog-ssg.touchczy.top/zh-cn/JavaScript/%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B%E7%9A%84%E7%90%86%E8%A7%A3.html

函数式编程是一种编程范式，不同于 OOP

在前端领域，我们同样能看到很多函数式编程的影子，ES6 中加入了箭头函数，Redux 引入 Elm 思路降低 Flux 的复杂性，React16.6 开始推出 React.memo()，使得 pure functional components 成为可能，16.8 开始主推 Hook，建议使用 pure function 进行组件编写等等。

特性

函数是一等公民
声明式编程 ：声明我需要做什么，而非怎么去做，接近自然语言
无状态和数据不可变
没有副作用
纯函数
柯里化
函数组合

## 类组件和函数式组件的区别

原理、状态、生命周期、使用方式

### 原理

分别基于 class extends React.Component 和 function

### state

● 类组件使用 setState 定义字节的内部状态
● 函数式组件一开始没有自己的状态，只能通过 props 传递外部的数据，有 hooks 后使用 useState

### 生命周期

● 类组件：构造，getDSfromProps, cDidMount,shouldCUpdate,cDidUpdate,cWillUnmounted....
● 函数组件：用 useEffect 代替 cDidMountcDidUpdatecWillUnmounted

### 使用方式

● 类组件：实例化后调用 render
● 函数组件：执行即是渲染

## 为什么需要 hooks

函数组件比起类组件少了很多东西，比如生命周期、对 state 的管理等。这就给函数组件的使用带来了非常多的局限性，导致我们并不能使用函数这种形式，写出一个真正的全功能的组件。而 React-Hooks 的出现，就是为了帮助函数组件补齐这些（相对于类组件来说）缺失的能力。

同时它还不强制你全都要，而是允许你自由地选择和使用你需要的那些能力，然后将这些能力以 Hook（钩子）的形式“钩”进你的组件里

**有状态但不需要编写 class**

## React Hooks 如何保存状态

React 官方文档中有提到，React Hooks 保存状态的位置其实与类组件的一致；
● 两者的状态值都被挂载在组件实例对象 FiberNode 的 memoizedState 属性中。
● 两者保存状态值的数据结构完全不同；
● 类组件是直接把 state 属性中挂载的这个开发者自定义的对象给保存到 memoizedState 属性中；
● 而 React Hooks 是用链表来保存状态的，memoizedState 属性保存的实际上是这个链表的头指针。

```js
// hooks基本结构---react-reconciler的ReactFiberHooks.old.js下

export type Hook = {
  memorizedState: any,
  baseState: any,
  baseQueue: Update<any,any> | null
  queue: any,
  next: Hook | null
}

其中state字段与状态与关
queue与状态更新有关
next是指向当前fiber的下一个hook的指针


```

● hook 在创建时会将第一个 hook 挂载到函数组件 fiber 的 memorizedState 字段上，
● 完成 fiber 节点的创建后，memorizedState 字段是一个链表结构，每一个节点都是 hook 的实例
● 特例
○ 除了 useContext 和 useDebugValue 不会创建 hook 结构之外其他 hook 都会创造 hook 结构，并按顺序组成链表
○ useContext 有其他方式实现，但是官方认为是 hook
○ useDebugValue 实现在 react-devtools 中
● 在不同阶段 useHook 实际调用的函数不同，第一次构建 fiber 时会调用 mountState 函数，以后每次更新都会调用 updateState 函数，通过这不同阶段改变 ReactCurrentDispatcher.current 的引用来使 useHook 函数这不同阶段调用不同函数
● 把 ReactCurrentDispatcher.current 看做一个全局唯一的变量（存有 App 组件的 fiber），其上面有名为 useState 的键名（其他 hook 也有），其具体指向 mountState 和 updateState
