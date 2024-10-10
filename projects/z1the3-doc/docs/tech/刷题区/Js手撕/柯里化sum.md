# add/sum（闭包）

```js
function add() {
  // 将传入的不定参数转为数组对象，闭包
  let args = [...arguments];

  // 递归：内部函数里面进行自己调用自己
  // 当 add 函数不断调用时，把第 N+1 个括号的参数加入到第 N 个括号的参数里面
  let inner = function (...param) {
    args.push(...param);
    return inner;
  };

  // console.log会调用该方法
  inner.toString = function () {
    // 把闭包args里的值求和
    return args.reduce(function (prev, cur) {
      return prev + cur;
    });
  };

  // ** 实现链式调用
  return inner;
}

// 测试一下
let result = add(1)(2)(3)(4);
console.log(result);
```
