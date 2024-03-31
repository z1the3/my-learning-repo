# nextTick

> DOM 更新是异步执行，然后用 nextTick 去获取相当于并列了两个微任务，nextTick 这个微任务在后面，所以能够获取到前面 DOM 更新的结
> 果；注意：DOM 更新只是指进行 DOM 操作，不是 UI 渲染

在下次 DOM 更新结束之后执行延迟回调。
在修改数据之后立即使用这个方法，可以获取更新后的 DOM
`{{num}}`

```js
for (let i = 0; i < 100000; i++) {
  num = i;
}
```

如果没有 nextTick 更新机制，

那么 num 每次更新值都会触发视图更新

(上面这段代码也就是会更新 10 万次视图,因为 num 是直接赋新值的操作,)

有了 nextTick 机制，只需要更新一次，所以 nextTick 本质是一种优化策略

可以将十万次操作放入队列中，融合成一次操作，再异步执行（能异步执行是实现的前提）

---

1. 把回调函数放入 callbacks 等待执行
2. 将负责触发回调函数执行的执行函数放到微任务或者宏任务中
3. 事件循环到了微任务或者宏任务，执行函数依次执行 callbacks 中的回调

核心降级函数顺序 promise.then -> mutationObserver -> setImmidate -> setTimeout

0.确定 timeFunc 创造怎样的宏微任务

```js
export let isUsingMicroTask = false;

// 决定timeFunc用什么方式
if (typeof Promise !== "undefined" && isNative(Promise)) {
  //判断1：是否原生支持Promise
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    if (isIOS) setTimeout(noop);
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== "undefined" &&
  (isNative(MutationObserver) ||
    MutationObserver.toString() === "[object MutationObserverConstructor]")
) {
  //判断2：是否原生支持MutationObserver
  let counter = 1;
  // new MO(异步回调)，当dom发生改变时，会触发flushCallbacks
  // 感觉可以用于实现响应式？

  // 在创建mutationObserver时传入flushCallbacks
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  // 改用宏任务
  isUsingMicroTask = true;
} else if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
  //判断3：是否原生支持setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  //判断4：上面都不行，直接用setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}
```

1.把回调函数放入 callbacks 数组

```js
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;

  // cb 回调函数会经统一处理压入 callbacks 数组
  callbacks.push(() => {
    if (cb) {
      // 给 cb 回调函数执行加上了 try-catch 错误处理
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, "nextTick");
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });

  // 如果不在等待，就顺便执行异步延迟函数 timerFunc
  if (!pending) {
    pending = true;
    timerFunc();
  }

  // 当 nextTick 没有传入函数参数的时候，返回一个 Promise 化的调用
  // 实现nextTick().then()
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
```

2.timerFunc 执行，将 flushCallback 变为宏微任务执行

```js
// flushCallbacks功能很简单，只有清空当前callback队列，将等待状态取消
function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}
```
