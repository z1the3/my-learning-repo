# 防抖 debounce

防抖最终一定执行（一直取消） 防抖函数最后一定创建新计时器
节流则一定会执行 节流不一定会创建

```js
function debounce(fn, wait) {
  let timer = null;

  return function () {
    // 注意args在这取，拿到返回function的参数
    const args = [...arguments];

    // 如果已经有，则清，到时间完再做
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // 不管怎样都要
    // 设置定时器，使事件间隔指定事件后执行

    // 使用外界this，从而可以被call,单纯箭头函数没有this
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}
```
