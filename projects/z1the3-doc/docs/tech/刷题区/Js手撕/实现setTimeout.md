# 实现 setTimeout

> window.cancelAnimationFrame

每隔一个 FRAME 轮询一次

```js
let setTimeout = (fn, timeout, ...args) => {
  // 初始当前时间
  const start = +new Date();
  let timer, now;
  const loop = () => {
    timer = window.requestAnimationFrame(loop);
    // 再次运⾏时获取当前时间
    now = +new Date();
    // 当前运⾏时间 - 初始当前时间 >= 等待时间 ===>> 跳出
    if (now - start >= timeout) {
      fn.apply(this, args);
      window.cancelAnimationFrame(timer);
    }
  };
  window.requestAnimationFrame(loop);
};
function showName() {
  console.log("Hello");
}
let timerID = setTimeout(showName, 1000);
// 在 1 秒后打印 “Hello
```
