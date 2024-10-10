# instanceof

```js
const _instanceof = (target, Fn) => {
  // 判断是不是基础数据类型
  if (target === null || typeof target !== "object") {
    return false;
  }
  let proto = Object.getPrototypeOf(target), // 获取对象的原型
    prototype = Fn.prototype; // 获取构造函数的 prototype 对象

  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;

    // 重复看proto
    proto = Object.getPrototypeOf(proto);
  }
};
```
