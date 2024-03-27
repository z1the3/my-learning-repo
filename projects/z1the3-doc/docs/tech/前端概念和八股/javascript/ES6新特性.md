# ES6 新特性

## ES6 新特性

- let 和 const
- 解构赋值（数组和对象
- 扩展运算符
- 字符串（模板字符串）
- Symbol
- Set Map
- Proxy Reflect
- Promise
- Iterator 和 for of
- Generator
- async
- Class
- Decorator 装饰器
- ES Module

```js
 const { [listType]: { infoList } } = this.props;
 const { keyword, typeId, state, listType } = this.state;

...hooks

属性延申是React特有的
var props = { foo: x, bar: y };
var component = <Component { ...props } />;
```

## 分类一下

- 表达式：声明、解构赋值
- 内置对象：字符串扩展（includes）、数值扩展、对象扩展、数组扩展、函数扩展（箭头函数）\*\*\_、正则扩展、Symbol、Set、Map、Proxy、Reflect
- 语句与运算：Class、Module、Iterator
- 异步编程：Promise、Generator、Async\_\*\*

## 箭头函数与普通函数的区别

- 表达更简洁
- 箭头函数没有自己的 this
- 箭头函数继承来的 this 指向无法改变
- 箭头函数不能作为构造函数使用
- 没有 arguments prototype 不能用作 generator

## Promise

promise.all

全部成功返回结果数组
失败一个立即结束,返回第一个被拒绝的原因

Promise.allSettled 方法返回的 Promise 会等待所有输入的 Promise 完成，不管其中是否有 Promise 被拒绝。如果你需要获取输入可迭代对象中每个 Promise 的最终结果，则应使用 allSettled 方法。
