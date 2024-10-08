# 节流 throttle

切记需要回收

```js
// 时间戳版
function throttle(fn, delay) {
  var preTime = Date.now();

  return function () {
    (args = [...arguments]), (nowTime = Date.now());

    // 如果两次时间间隔超过了指定时间，则执行函数。
    if (nowTime - preTime >= delay) {
      preTime = nowTime;
      // 虽然这个版本有return值
      // 不过节流本身的意义就不会需要使用return
      return fn.apply(this, args);
    }
  };
}

// 定时器版
function throttle(fn, wait) {
  let timer = null;
  return function () {
    // 此处的arguments为 throttle(fn(1,2,3),wait)的[1,2,3]
    let args = [...arguments];
    // 只有在未开启定时器时才会开启，并不会覆盖；开启了就会占着走完执行
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        // 回收定时器
        timer = null;
      }, wait);
    }
  };
}
```

但是节流存在两种情况 1.如果使用定时器法，第一次执行，它**也会延迟 wait 毫秒执行**，我们希望第一次能立即执行；
使用时间戳法可以实现

2.如果使用时间戳法，最后一次是不执行的，因为判断之后发现没到 ddl，直接结束了
使用定时器法可以解决，最后一次必然会在定时器结束后执行

将两种方法结合可以解决这个问题

```js
function throttle(fn, delay) {
  let timer = null;
  let start = Date.now();
  return function () {
    let args = [...arguments];
    let curTime = Date.now();
    let remain = delay - (curTime - start);
    clearTimeout(timer); //***
    timer = null;
    if (remain <= 0) {
      fn(args);
      start = Date.now();
    } else {
      timer = setTimeout(() => fn.apply(this, args), remain);
    }
  };
}
```

```

```
