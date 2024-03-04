# React

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
-G 在 map 里找不到，需要创建并插入 -将 map 中剩余的元素 D F 标记为删除

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
