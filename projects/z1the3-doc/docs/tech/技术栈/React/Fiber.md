# Fiber 架构

## React 更新流程

schedule（调度器） 负责
维护时间切片
与浏览器任务调度
优先级调度

reconciler（协调器）负责
将 JSX 转化为 fiber
fiber 树对比（双缓存）+ 增量 diff
确定本次更新的 fiber

renderer(渲染器）（renderDOM, renderSSR)
用于管理一颗 react 树
使其根据底层平台不同，用不同方式调用，实现跨端

### 事件处理

- 原生 dom 上提供事件处理 `@onclick="foo()"` 传入字符串并执行函数（用的很少）
- react 上提供事件处理 `@onClick={foo}` 小驼峰
  react 必须显式调用 event 对象上的 preventDefault 方法来阻止事件的默认行为
  如果想不用合成事件处理，可以用 e.nativeEvent 拿到被包装前的原生事件

Fiber 的两个重要点

1.中断再恢复  
2.优先级，高优先级的尽量优先，其他的符合空闲时渲染的特征

## Fiber

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

其实整个 render(协调) 阶段就是异步地创建 workInProgress 树，可以把它看做是一个草稿，等这个草稿完成了，

就会同步地将其绘制到页面中。这时 workInProgress 树就变成了 current 树。Fiber 节点上有个属性叫 alternate，将两棵树关联起来。

通过 alternate 相互引用和角色切换，避免了每次更新都创建。

fiberRootNode 整个应用的根节点，每调用一次 ReactDom.render 都会创建一个 rootFiber 。

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/bfcb8edd-2eaa-4198-8883-c543ca388640.png" width="500"/>

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

## Fiber 与 requestIdleCallback

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
