# Fiber 架构

Fiber 的两个重要点

1.中断再恢复  
2.优先级，高优先级的尽量优先，其他的符合空闲时渲染的特征

## Fiber

在 react 16 之前，Reconcilation 是同步的、递归执行的，通常也称它为 Stack Reconcilation，
栈对于树这种数据结构的处理非常方便，也容易理解，但这种依赖于调用栈的方式不能随意中断，也很难被恢复，不利于异步处理。 这种调用栈，不是程序所能控制的， 如果你要恢复递归现场，可能需要从头开始, 恢复到之前的调用栈。
所以 react 开发者想到了用链表模拟栈的做法，链表中断后的处理要更加容易些。

### 什么是 Fiber

> 在计算机科学中，Fiber 是一种最轻量化的线程。它是一种用户态线程，让应用程序可以独立决定自己的线程要> 如何运作, 模拟线程的让出。操作系统内核不能看见它，也不会为它进行调度。 ——维基百科

把渲染更新过程拆分成多个子任务，每次只做一小部分，做完看是否还有剩余时间，如果有继续下一个任务；如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候在继续执行。 这种策略叫做 Cooperative Scheduling（合作式调度），操作系统常用任务调度策略之一。

协程（Coroutines）是一种比线程更加轻量级的存在，正如一个进程可以拥有多个线程一样，一个线程可以拥有多个协程。
协程不是进程也不是线程，而是一个特殊的函数，这个函数可以在某个地方挂起，并且可以重新在挂起处外继续运行。所以说，协程与进程、线程相比并不是一个维度的概念。

- 一个线程内的多个协程虽然可以切换，但是多个协程是串行执行的，只能在一个线程内运行，没法利用 CPU 多核能力。
- 协程与进程一样，切换是存在上下文切换问题的。
  举例：ES6 新增的 Generator

### 在 React 当中

Concurrency 是 React 18 的关键词，可以理解成是一种背后的机制，保证 React 能够同时准备多套 UI。具体到表现上区别于以往的最大的特点就是渲染是可中断的。

这意味着当你的应用正在进行复杂更新的时候，仍然可以与页面进行交互，保证一个流畅的用户体验。

既然是一种背后的机制，实际上开发者并非需要先学习并发渲染才能使用 React18，但是能够掌握并发渲染对于新特性的理解有非常大的作用。

这边宏观介绍一下，核心实现是通过组件作为一个基本的工作单元将一个大的更新任务进行拆分，然后以时间切片的方式，分布在不同的时间片来执行，

每个时间片执行完成后都会主动释放控制权，使得浏览器能够处理其它用户事件。

而具体时间片上执行哪个任务是由任务上的相关优先级决定的，当高优先级的更新到来时，会中断旧的更新，优先执行高优先级更新，待完成后继续执行低优先级更新。

react17 就已经有对 concurrent 模式的实验支持
在 React 中，Fiber 指的是一种协调引擎，又被称为 Concurrent (并发)模式，在版本 17.0.0 中，React 提供了三种渲染方式, 在根组件可以控制

```js

1. legacy 模式： ReactDOM.render(<App />, rootNode)
2. blocking 模式： ReactDOM.createBlockingRoot(rootNode).render(<App />)
3. concurrent 模式： ReactDOM.createRoot(rootNode).render(<App />)
```

https://www.w3.org/TR/requestidlecallback/

react18 后，创建应用根节点方式改变

其实是模式改变(legacy to concurrent)

```js
import { render } from "react-dom";
const container = document.getElementById("app");
render(<App tab="home" />, container);

//卸载应用根节点
unmountComponentAtNode(container);
```

```js
import { createRoot } from "react-dom/client";
const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App tab="home" />);

//卸载应用根节点
root.unmount();
```

如果我们依赖的 React 版本在 18，我们使用 legacyMode 模式，会提示这样的 warning，但并不影响我们的运行，这只是提示我们可以使用 currentMode 的方式

当然不只是渲染机制改变

legacy 和 concurrency 的区别

First, this fixes some of the ergonomics of the API when running updates. As shown above, in the legacy API, you need to continue to pass the container into render, even though it never changes. This also mean that we don’t need to store the root on the DOM node, though we still do that today.

// SSR 相关
Second, this change allows us to remove the hydrate method and replace with with an option on the root; and remove the render callback, which does not make sense in a world with partial hydration

除了创建的方面提供了新的方法，在 render 完成后的回调函数也做了更新。
React 18 之前的版本

```js
ReactDOM.render(container, <App tab="home" />, function() {
  // Called after inital render or any update.
  console.log('rendered').
});
```

React 18 版本，删除了上面的回调函数：这个回调函数在某些情况下（ssr）并不能在期望的时间被触发。现在可以通过在根元素上绑定 requestIdleCallback, setTimeout, 或 ref 实现类似的功能。

```js
function App({ callback }) {
  // Callback will be called when the div is first created.
  return (
    <div ref={callback}>
      <h1>Hello World</h1>
    </div>
  );
}
const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);
root.render(<App callback={() => console.log("renderered")} />);
```

#### 也是一种数据结构

React 将它视作一个执行单元，每次执行完一个'执行单元', React 就会检查现在还剩多少时间，如果没有时间就将控制权让出去.
React 没有使用 Generator 这语法层面的让出机制，而是实现了自己的调度让出机制。这个机制就是基于 Fiber 这个执行单元的。

目前市面上的主流前端框架/库 主要在以下两个方面实现性能优化：

1.在一个时间片里尽量做更多事，快速响应用户，让用户觉得够快,优先级低的事放到下一个时间片（react）

2.优化每个任务，让任务执行的时间更短（vue）

### 原理

#### 如何让浏览器持续保持响应

> 开启了异步更新，也就是 Concurrent Mode
> 由于 JS 是单线程的，如果 JS 在执行脚本，那么浏览器事件是无法响应的。所以，为了能够快速响应高优先级事件，不让浏览器假死，就必须在每帧的 16.6.ms 中预留一部分给浏览器。也就意味连续执行脚本时间不能超过 16.6。React Fiber 将这个时间定为 5ms（动态的）。
> 在遍历组件构建 Fiber 过程中，每处理完一个节点，就会判断一下，是否还有剩余时间，如果没有了，则会交出控制权(setTimeout(0))。

---

React 的组件更新是 CPU 密集的操作，因为它要做对比新旧虚拟 DOM 树的操作（diff，React 中 Reconcilation 负责），找出需要更新的内容（patch），通过打补丁的方式更新真实 DOM 树（React 中 Renderer 负责）。当要对比的组件树非常多时，就会发生大量的新旧节点对比，CPU 花费时间庞大，当耗时大大超过 16.6ms（一秒 60 帧的基准） 时，用户会感觉到明显的卡顿。

这一系列操作是通过递归的方式实现的，是 同步且不可中断 的。因为一旦中断，调用栈就会被销毁，中间的状态就丢失了。这种基于调用栈的实现，我们称为 Stack Reconcilation。

React 16 的一个重点工作就是优化更新组件时大量的 CPU 计算，最后选择了使用 “时间分片” 的方案，就是将原本要一次性做的工作，拆分成一个个异步任务，在浏览器空闲的时间时执行。这种新的架构称为 Fiber Reconcilation。

在 React 中，**Fiber 模拟之前的递归调用，具体通过链表的方式去模拟函数的调用栈**，这样就可以做到中断调用，将一个大的更新任务，拆分成小的任务，并**设置优先级**，在浏览器空闲的时异步执行。

前面我们说到使用了链表的遍历来模拟递归栈调用，其中链表的节点 React 用 FiberNode 表示。

FiberNode 其实就是虚拟 DOM，它记录了：

节点相关类型，比如 tag 表示组件类型、type 表示元素类型等。
节点的指向。
副作用相关的属性。
lanes 是关于调度优先级的。

### lanes

不同优先级的任务间，会存在一种现象：当执行低优先级任务时，突然插入一个高优先级任务，那么会中断低优先级的任务，先执行高优先级的任务，我们可以将这种现象称为任务插队。当高优先级任务执行完，准备执行低优先级任务时，又插入一个高优先级任务，那么又会执行高优先级任务，如果不断有高优先级任务插队执行，那么低优先级任务便一直得不到执行，我们称这种现象为任务饥饿问题。

但是任务有最长必须执行时间，过期能立即同步执行

react 事件优先级会转为 lanes 优先级再转为调度器优先级

```js
事件优先级;
// 离散事件优先级，例如：点击事件，input输入等触发的更新任务，优先级最高
export const DiscreteEventPriority: EventPriority = SyncLane;
// 连续事件优先级，例如：滚动事件，拖动事件等，连续触发的事件
export const ContinuousEventPriority: EventPriority = InputContinuousLane;
// 默认事件优先级，例如：setTimeout触发的更新任务
export const DefaultEventPriority: EventPriority = DefaultLane;
// 闲置事件优先级，优先级最低
export const IdleEventPriority: EventPriority = IdleLane;

调度优先级;
export const NoPriority = 0; //没有优先级
export const ImmediatePriority = 1; // 立即执行任务的优先级，级别最高
export const UserBlockingPriority = 2; // 用户阻塞的优先级
export const NormalPriority = 3; // 正常优先级
export const LowPriority = 4; // 较低的优先级
export const IdlePriority = 5; // 优先级最低，闲表示任务可以闲置
```

有任务过期， 过期则立即同步执行 不在时间切片

#### 为什么不用 generator 或 async/await？

generator 和 async/await 也可以做到在函数中间暂停函数执行的逻辑，将执行让出去，能做到将同步变成异步。

但 React 没有选择它们，这是因为：

具有传染性，比如一个函数用了 async，调用它的函数就要加上 async，有语法开销，此外也会有性能上的额外开销。
无法在 generator 和 async/await 中恢复一些中间状态。

## fiber 结构

```js
export type Fiber = {
  // Fiber 类型信息
  type: any,
  // ...
  // 链表结构
  // 指向父节点，或者render该节点的组件
  return: Fiber | null,
  // 指向第一个子节点
  child: Fiber | null,
  // 指向下一个兄弟节点
  sibling: Fiber | null,
};

children: 指向第一个子元素
sibling:当前元素的下一个兄弟元素
return:上一个父元素

通过return可以随时回到上面
```

有了这个数据结构调整，现在可以以迭代的方式来处理这些节点了。来看看 performUnitOfWork 的实现, 它其实就是一个深度优先的遍历

```js
/**
 * @params fiber 当前需要处理的节点
 * @params topWork 本次更新的根节点
 */
function performUnitOfWork(fiber: Fiber, topWork: Fiber) {
  // 对该节点进行处理
  beginWork(fiber);
  // 如果存在子节点，那么下一个待处理的就是子节点
  if (fiber.child) {
    return fiber.child;
  }
  // 没有子节点了，上溯查找兄弟节点
  let temp = fiber;
  while (temp) {
    completeWork(temp);
    // 到顶层节点了, 退出
    if (temp === topWork) {
      break;
    }
    // 找到，下一个要处理的就是兄弟节点
    if (temp.sibling) {
      return temp.sibling;
    }
    // 没有, 继续上溯
    temp = temp.return;
  }
}
```

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/4312ffcd-f070-4dec-9e10-80b822b5fc3.png" width="500"/>

## Fiber 双缓冲技术

当 render 的时候有了这么一条单链表，当调用 setState 的时候又是如何 Diff 得到 change 的呢？

采用的是一种叫双缓冲技术（double buffering），这个时候就需要另外一颗树：WorkInProgress Tree，它反映了要刷新到屏幕的未来状态。

WorkInProgress Tree 构造完毕，得到的就是新的 Fiber Tree，然后喜新厌旧（把 current 指针指向 WorkInProgress Tree，丢掉旧的 Fiber Tree）就好了。

这样做的好处：

- 能够复用内部对象（fiber）
- 节省内存分配、GC 的时间开销
- 就算运行中有错误，也不会影响 View 上的数据

在 React 中，最多可能会存在两个 Fiber 树。

一个叫 current ，它跟当前屏幕上的 UI 相对应的。

还有一个叫 workInProgress，在状态发生更新时，基于下次屏幕渲染的状态内存构建的 Fiber 树。 这个树保存了下次更新屏幕 UI 所对应的状态。

其实整个 reconcile(协调) 阶段就是异步地创建 workInProgress 树，可以把它看做是一个草稿，等这个草稿完成了，

就会同步地将其绘制到页面中。这时 workInProgress 树就变成了 current 树。Fiber 节点上有个属性叫 alternate，将两棵树关联起来。

通过 alternate 相互引用和角色切换，避免了每次更新都创建。

fiberRootNode 整个应用的根节点，每调用一次 ReactDom.render 都会创建一个 rootFiber 。

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/bfcb8edd-2eaa-4198-8883-c543ca388640.png" width="500"/>

### fiber 树比较方式

在 fiber node 上进行递归

但是在比对时有缓存的逻辑，所以不是严格的树的每个节点对比

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/image (17).png" width="1500"/>

## react fiber 更新优先级

这里不是不同 fiber 有不同优先级

而是一轮更新被拆成多轮更新，每轮更新对所有 fiber 上该优先处理的 updater

Fiber 节点上有个 updateQueue 属性，React 每次触发更新都会生成一个 updater，然后加入该队列。
在 React Fiber 之前，这些 Updater 是没有优先级的，当执行完一个 Update 后，就会拿队列中第一个继续执行。
在 React Fiber 之后，React 对各类更新标记了不同的优先级，具体如下：

- 生命周期方法：同步执行。
- 受控的用户输入：比如输入框内输入文字，同步执行。
- 交互事件：比如动画，高优先级执行。
- 其他：比如数据请求，低优先级执行。
  同步执行的是最高优先级的。

为了优先处理高优先级更新，标记了优先级还不够，还需要快。
前面提到，为了让浏览器保持持续响应，React 每次执行构建脚本只花费 5ms，就交出执行权。当 React 再次获取到执行权后，会在通过调度器(Schedule)，获取最高优先级的 Updater 优先执行。

## Fiber 与 requestIdleCallback( 优先级与浏览器 API 的关联)

Fiber 所做的就是需要分解渲染任务，然后根据优先级使用 API 调度，异步执行指定任务：

1. 低优先级任务由 requestIdleCallback 处理；
2. 高优先级任务，如动画相关的由 requestAnimationFrame 处理；
3. requestIdleCallback 可以在多个空闲期调用空闲期回调，执行任务；
4. requestIdleCallback 方法提供 deadline，即任务执行限制时间，以切分任务，避免长时间执行，阻塞 UI 渲染而导致掉帧；

假设用户调用 setState 更新组件, 这个待更新的任务会先放入队列中, 然后通过 requestIdleCallback 请求浏览器调度

```js
updateQueue.push(updateTask);
requestIdleCallback(performWork, { timeout });
```

现在浏览器有空闲或者超时了就会调用 performWork 来执行任务：

```js
// 1️⃣ performWork 会拿到一个Deadline，表示剩余时间
function performWork(deadline) {
  // 2️⃣ 循环取出updateQueue中的任务
  while (updateQueue.length > 0 && deadline.timeRemaining() > ENOUGH_TIME) {
    workLoop(deadline);
  }

  // 3️⃣ 如果在本次执行中，未能将所有任务执行完毕，那就再请求浏览器调度
  if (updateQueue.length > 0) {
    requestIdleCallback(performWork);
  }
}
```

workLoop**的工作会从更新队列(updateQueue)中弹出更新任务来执行，每执行完一个‘执行单元‘，就检查一下剩余时间是否充足，如果充足就进行执行下一个**执行单元，反之则停止执行，保存现场，等下一次有执行权时恢复

fiber 也作为工作单元，它有以下属性保存更新记录。

```js
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
// 保存本次更新会造成的DOM操作
this.effectTag = NoEffect;
// 链表
this.nextEffect = null;
this.firstEffect = null;
this.lastEffect = null;
```

React 用空间换时间，更高效的操作可以方便根据优先级进行操作。同时可以根据当前节点找到其他节点，在挂起和恢复过程中起到了关键作用。

## 最后一个问题

Fiber 让 React 更快了吗？
Fiber 并没有让 React 变得更快了，反而是更慢了。之前一次更新同步执行可能需要 30ms，现在由于每 5ms 就会退出执行，进行一系列判断，增加了额外的调度时间，总的执行时间肯定大于 30ms 了。
但是，Fiber 让 React 更丝滑了，不至于让浏览器假死，能快速响应用户交互。
也许，用户要得并不是快...。
