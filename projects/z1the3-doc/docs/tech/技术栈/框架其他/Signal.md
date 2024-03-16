# Signal

> Signal 是在应用中存储状态的一种方式，类似于 React 中的 useState()。两者的关键区别在于，Signal 返回一个 getter 和一
> 个 setter，而非响应式系统只返回一个值和一个 setter。

Signal（信号）是一种存储应用状态的形式，类似于 React 中的 ​​useState()​​。但是，有一些关键性差异使 Signal 更具优势。Vue、Preact、Solid 和 Qwik 等流行 JavaScript 框架都支持 Signal。

Signal 并不是最近才出现的，在此之前，它已经存在于 Knockout 等框架中。不过，在最近几年通过巧妙的编译器技巧和与 JSX 的深度集成极大地改进了它的开发者体验·，这使得它非常简洁并且使用起来很方便。

下面就来看看 Signal 都有哪些优势，为什么说它是前端框架的未来

State 混淆了两个独立的概念：

StateReference：对状态的引用。
StateValue：存储在状态引用/存储中的实际值。
那为什么返回一个 getter 比返回一个值更好呢？因为通过返回 getter，可以将状态引用的传递与状态值的读取分开。

为了具有响应式，Signal 必须要收集谁对它的值感兴趣。它通过观察在什么情况下调用状态 getter 来获取此信息。通过从 getter 中获取值，告诉 Signal 该位置对该值感兴趣。如果值发生变化，则需要调用 getter 创建一个订阅。

这就是为什么传递状态 getter 而不是状态值很重要的原因。状态值的传递不会向 Signal 提供有关实际使用该值的位置的任何信息。这就是为什么区分状态引用和状态值在 Signal 中如此重要。

(getter/setter) 被替换为具有 .value 属性（表示 getter/setter）的单个对象。

当单击按钮并增加值时，框架只需要将文本节点从 0 更新为 1。它可以这样做是因为在模板的初始渲染期间，Signal 已经知道 count.value 只能被文本节点访问。因此，它知道如果 count 的值发生变化，就只需要更新文本节点而无需更新其他地方。

## React

React 的 useState() 会返回一个状态值。这意味着 useState() 不知道组件或应用内部如何使用状态值。所以，一旦通过调用 setCount() 通知 React 状态更改，React 就不知道页面的哪一部分发生了更改，因此必须重新渲染整个组件，这在计算上是很昂贵的。

useRef() 的使用与 useSignal() 完全一样，用于传递对状态的引用而不是状态本身。但是，useRef() 缺少了订阅跟踪和通知。

在基于 Signal 的框架中，useSignal() 和 useRef() 是一样的。useSignal() 可以执行 useRef() 加上订阅跟踪的功能，这样就进一步简化了框架的 API。

有了 Signal，也省下了 react 使用 useMemo 的步骤

> 引用 https://www.51cto.com/article/746842.html
