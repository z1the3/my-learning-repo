# new 关键字

箭头函数之所以不可以作为构造函数：

1. 没有 this，不能绑定新 this 的同时执行一次构造函数
2. 没有 prototype，不能给新对象当作 proto

```js
const _new = function (constructor, ...args) {
  // new关键字做了4件事
  // 1. 创建一个新对象
  const obj = {};
  // 2. 为新对象添加属性__proto__，将该属性链接至构造函数的原型对象
  obj.__proto__ = constructor.prototype;
  // 3. 执行构造函数，this被绑定在新对象上
  const res = constructor.apply(obj, args);
  // 4. 确保返回一个对象，前者需要构造函数返回this，后者直接返回obj即可（构造函数内已经操作了obj）
  return res instanceof Object ? res : obj;
};
```

和object create的区别是

- object create利用了new，自身创建了构造函数
- new的输入是构造函数，object create的输入是构造函数的prototype
