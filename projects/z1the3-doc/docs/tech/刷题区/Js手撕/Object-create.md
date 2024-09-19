# Object.create

自己搞个构造函数出来

```js
const _objectCreate = (proto) => {
  if (typeof proto !== "object") return;
  const fn = function () {};
  fn.prototype = proto;
  // 如果proto为null, 返回的是一个干净的对象
  return new fn();
};
```
