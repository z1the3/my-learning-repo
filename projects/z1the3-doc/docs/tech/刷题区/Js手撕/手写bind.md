# 手写bind

### Function.prototype.bind

```js
// 注意在Function原型上绑定
Function.prototype.bind = function (context, ...args) {
  // 拿到fn.bind()的fn
  let fn = this;
  //这里用...rest为了实现foo.bind(null,"a","b")("c","d","e");
  return function (...rest) {
    return fn.apply(context, [...args, ...rest]);
  };
};

// 简化版
const bind =
  (fn, ctx, ...args) =>
  (...restArgs) =>
    fn.call(ctx, ...args, ...restArgs);
```
