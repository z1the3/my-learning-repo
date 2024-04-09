# setState 和批处理

batchingStrategy 对象可以理解为“锁管理器”。

这里的“锁”，是指 React 全局唯一的 isBatchingUpdates 变量，isBatchingUpdates 的初始值是 false，意味着“当前并未进行任何批量更新操作”。每当 React 调用 batchedUpdate 去执行更新动作时，会先把这个锁给“锁上”（置为 true），表明“现在正处于批量更新过程中”。

当锁被“锁上”的时候，任何需要更新的组件都只能暂时进入 dirtyComponents 里排队等候下一次的批量更新，而不能随意“插队”。此处体现的“任务锁”的思想，是 React 面对大量状态仍然能够实现有序分批处理的基石。

## React 中 setState 后发生了什么

在代码中调用 setState 函数之后，React 会将传入的参数对象与组件当前的状态合并，然后触发调和过程(Reconciliation)。经过调和过程，React 会以相对高效的方式根据新的状态构建 React 元素树并且着手重新渲染整个 UI 界面。

在 React 得到元素树之后，React 会自动计算出新的树与老树的节点差异，然后根据差异对界面进行最小化重渲染。在差异计算算法中，React 能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。

如果在短时间内频繁 setState。React 会将 state 的改变压入栈中，在合适的时机，批量更新 state 和视图，达到提高性能的效果。

出于性能原因，会将 React 事件处理程序中的多次 React 事件处理程序中的多次 setState 的状态修改合并成一次状态修改。 最终更新只产生一次组件及其子组件的重新渲染

### 不一定是累积状态

对于相同属性的设置，React 只会为其保留最后一次的更新

```js
this.setState({
  count: this.state.count + 1,
});
this.setState({
  count: this.state.count + 1,
});
```

同步代码中写相同的 setState
只有最后一次有效

## setState 是同步还是异步的

setState 并不是单纯同步/异步的，它的表现会因调用场景的不同而不同。在源码中，通过 isBatchingUpdates 来判断 setState 是先存进 state 队列还是直接更新，如果值为 true 则执行异步操作，为 false 则直接更新。
● 异步：在 React 可以控制的地方，就为 true，比如在 React 生命周期事件和合成事件中，都会走合并操作，延迟更新的策略。
● 同步：在 React 无法控制的地方，比如原生事件，具体就是在 addEventListener 、setTimeout、setInterval 等事件中，就只能同步更新。

react18 之后，setState 都为异步，无论写在什么样的语法环境中。  
但可以使用 flushSync 方法 使之变为同步

### Auto Batching 自动批化(18 升级)

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
