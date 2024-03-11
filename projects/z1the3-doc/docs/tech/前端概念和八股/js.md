# js

## 继承

- 原型链继承，把子类原型指向父类的一个实例，但是多个子类共享这个实例，如果实例上有引用类型会造成紊乱

- 构造函数继承，在子类的构造函数中调用父类构造函数，从而可以传参数，但是只能继承属性不能继承方法

- 组合继承 = 原型链继承＋构造函数继承，但因为用的是父类的实例，所以执行了两次父类构造函数，子类实例和原型上同时有 a 属性

- 寄生继承，把父类的原型拷贝，再把子类原型指向拷贝

- 寄生组合式继承 = 寄生继承＋构造函数继承（缺点？如果方法没写在父类原型而是写在父类上则继承不到？）

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

## Symbol

ES6 引入了一种新的原始数据类型 Symbol，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。

Symbol 值通过 Symbol 函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。

注意，Symbol 函数前不能使用 new 命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。也就是说，由于 Symbol 值不是对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型。

```js
{
  let a1 = Symbol.for("abc");
  let obj = {
    [a1]: "123", //参考api中对象的扩展部分中属性名表达式，这里[a1]代表变量a1的key
    abc: "123",
    c: 456,
  };
  console.log("obj", obj);
}

{abc: "123", c: 456, Symbol(abc): "123"}

可以看到两个abc是不冲突的
```

常规的 for in，let of 的方式去取 ，比如 Object.entries,Object.keys，是拿不到 symbol 的值

使用 Object.getOwnPropertySymbols(obj) 。这种方式只拿到了 symbol 的变量的值

使用 Reflect.ownKeys(obj)

## this 绑定

this 绑定的优先级：new 绑定 > 显式绑定 > 隐式绑定 > 默认绑定。

## 生成器 + 迭代器

迭代器可以用生成器语法实现，也可以不用

使用主要是为了允许你定义一个不会被连续执行的函数作为迭代算法

在 JavaScript 中，迭代器是一个对象，它定义一个序列，并在终止时可能附带一个返回值。

更具体地说，迭代器是通过使用 next() 方法实现了迭代器协议的任何一个对象，该方法返回具有两个属性的对象：

value
迭代序列的下一个值。

done
如果已经迭代到序列中的最后一个值，则它为 true。如果 value 和 done 一起出现，则它就是迭代器的返回值。

一些语句和表达式专用于可迭代对象，例如 for...of 循环、展开语法、yield\* 和解构语法。

```js
function* fibonacci() {
  let current = 0;
  let next = 1;
  while (true) {
    const reset = yield current;
    [current, next] = [next, next + current];
    if (reset) {
      current = 0;
      next = 1;
    }
  }
}

const sequence = fibonacci();
console.log(sequence.next().value); // 0
console.log(sequence.next().value); // 1
console.log(sequence.next().value); // 1
console.log(sequence.next().value); // 2
console.log(sequence.next().value); // 3
console.log(sequence.next().value); // 5
// 手动传入 reset 为 undefined
console.log(sequence.next().value); // 8
// 手动传入 reset 为 true
console.log(sequence.next(true).value); // 0
console.log(sequence.next().value); // 1
console.log(sequence.next().value); // 1
console.log(sequence.next().value); // 2
```

迭代器

```js
function makeRangeIterator(start = 0, end = Infinity, step = 1) {
  let nextIndex = start;
  let iterationCount = 0;

  const rangeIterator = {
    next() {
      let result;
      if (nextIndex < end) {
        result = { value: nextIndex, done: false };
        // 一次进一个 step
        nextIndex += step;
        iterationCount++;
        return result;
      }
      return { value: iterationCount, done: true };
    },
  };
  // 返回迭代器对象
  return rangeIterator;
}
```

```js
let it = makeRangeIterator(1, 10, 2);

let result = it.next();
while (!result.done) {
  console.log(result.value); // 1 3 5 7 9
  result = it.next();
}

console.log(`已迭代序列的大小：${result.value}`); // 5
```

```js
function* makeIterator() {
  yield 1;
  yield 2;
}

const it = makeIterator();

for (const itItem of it) {
  console.log(itItem);
}

console.log(it[Symbol.iterator]() === it); // true

// 这个例子向我们展示了生成器（迭代器）是可迭代对象，
// 它有一个 @@iterator 方法返回 it（它自己），
// 因此，it 对象只能迭代*一次*。

// 如果我们将它的 @@iterator 方法改为一个返回新的迭代器/生成器对象的函数/生成器，
// 它（it）就可以迭代多次了。

it[Symbol.iterator] = function* () {
  yield 2;
  yield 1;
};
```

## find 和 some

some 方法找到符合条件的值则立即返回 true，全都不符合则返回 false，而 find 方法找到符合条件的值后会返回符合条件的那一项,所以在开发中视业务需求选择对应的方法
s
