# React

## 类组件

● 类组件：构造，getDSfromProps, cDidMount,shouldCUpdate,cDidUpdate,cWillUnmounted....

● 函数组件：用 useEffect 代替 cDidMountcDidUpdatecWillUnmounted

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

## diff

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/WeChat79b74639b63015e2b71c53c668c99c71.jpg" width="500"/>

前提： 只对同级节点比较，如果跨层级，则不复用

用 key 来构建一个老节点的 map，复用后要从 map 中删除
用 lastPlacedIndex 表示最后一个不需要移动的节点

思路是递增法
通过比较当前列表中的节点在原列表中拿到位置是否递增，来判断是否需要移动

将 A B C D E F 修改为 A C E B G 的执行顺序

-先将 ABCDEF 存到 map 里

-指针遍历 ACEBG
-lastPlacedIndex = 0
-A 在 map 里面存在，而且位置相同，复用节点更新属性
-C 对比 lastPlacedIndex(0) < oldIndex(2)，lastPlacedIndex = 2，位置不动，只更新属性
-E 对比 lastPlacedIndex (2)< oldIndex(4)，lastPlacedIndex = 4，位置不动，只更新属性 -（以上 ACE 的相对次序一致，所以不用改变位置
-B 对比 lastPlacedIndex(4) > oldIndex(2)，需要移动位置并更新属性
-G 在 map 里找不到，需要创建并插入  
-将 map 中剩余的元素 D F 标记为删除

-修改 dom 的顺序: 先删除，然后更新与移动，最后做插入操作

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

事件处理

- 原生 dom 上提供事件处理 @onclick="foo()" 传入字符串并执行函数（用的很少）
- react 上提供事件处理 @onClick={foo} 小驼峰
  react 必须显式调用 event 对象上的 preventDefault 方法来阻止事件的默认行为
  如果想不用合成事件处理，可以用 e.nativeEvent 拿到被包装前的原生事件

Fiber 的两个重要点 1.中断再恢复 2.优先级，高优先级的尽量优先，其他的符合空闲时渲染的特征

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

## UseLayoutEffect

其函数签名与 useEffect 相同，但它会在 所有的 DOM 变更之后，同步(即阻塞式)地 调用 effect。

可以使用它来读取 DOM 布局并同步触发重渲染。

在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

useLayoutEffect 与 componentDidMount、componentDidUpdate 的调用阶段是一样的。

useLayoutEffect 会阻塞浏览器主线程，里面的所有修改都会在下次渲染时体现。而 useEffect 会先让出主线程，将任务添加到事件队列中等候执行。（具体看 DevTools / Performance / Main 的 Task 就好，放大看一眼就明白了）

---

useEffect 会在浏览器渲染新内容后异步执行，也就是说当组件更新后，它并不会立即执行。 而 useLayoutEffect 会在 DOM 更新之后，浏览器绘制之前同步执行。

所以说，区别是一个为同步，一个为异步，你可以理解为 useLayoutEffect 与 useEffect 的执行时机都是在“DOM 更新之后和浏览器绘制之前”（它们会在 React 更新 DOM 完成之后立即执行，但在浏览器进行 DOM 重排和绘制之前）。这样可以确保在 React 更新 DOM 之后立即执行副作用代码，而不需要等到下一个渲染周期

不过，虽然 useLayoutEffect 是同步执行的，但它也是在 React 更新 DOM 完成之后才执行的。因此，在 useLayoutEffect 中访问 DOM 元素时，可以确保它们已经被更新。而在 useEffect 中访问 DOM 元素时，则需要注意它们可能还没有被更新，因为 useEffect 是异步执行的。如果需要在更新 DOM 后立即执行一些操作，应该使用 useLayoutEffect。否则，应该使用 useEffect。

---

在 mount 阶段 useEffect 对应 mountEffect, useLayoutEffet 对应 mountLayouEffect
两个函数都会直接返回 mountEffectImpl 函数，区别是参数有所不同

```js
mountEffectImpl(UpdateEffect | PassiveEffect, HookPassive, create, deps);

mountLayoutEffectImpl(UpdateEffect, HookLayout, create, deps);
```

mountEffectImpl 函数会把第一参数 fiberFlag 合并到 fiber.flag 来标志 fiber 节点的副作用类型，随后调用 pushEffect 函数生成一个 effect 并加到 hook.memoziedState 属性和 fiber.updateQueue.lastEffect 环型链表上

```js
function mountEffectImpl(fiberFlags, hookFlags, create, deps):void {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps ===undefined? null: deps
  currentlyRenderingFiber.flags |= fiberFlag
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    undefined,
    nextDeps
  )
}

// lastEffect是环形链表
function pushEffect(tag, create, destory, deps){
  const effect: Effect = {
    tag,
    create,
    destory,
    deps,
    next:(null:any)
  }
  let componentUpdateQueue = null | FunctionComponentUpdateQueue =
    (currentlyRenderingFiber.updateQueue)
  if(componentUpdateQueue === null){
    componentUpdateQueue = createFunctionComponentUpdteQueue()
    currentlyRenderingFiber.updateQueue = (componentUpdateQueue:any)
    componentUpdateQueue.lastEffect = effect.next = effect
  } else {
    const firstEffect = lastEffect.next
    lastEffect.next = effect
    effect.next = firstEffect
    componentUpdateQueue.lastEffect = effect
  }
  return effect

}
```

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1709693030086.jpg" width="1000"/>

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
