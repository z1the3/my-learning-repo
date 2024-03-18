# js

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

### Symbol()

每个从 Symbol() 返回的 symbol 值都是唯一的。一个 symbol 值能作为对象属性的标识符

```js
console.log(Symbol("foo") === Symbol("foo"));
// Expected output: false
```

### Symbol.for()

和 Symbol() 不同的是，用 Symbol.for() 方法创建的 symbol 会被放入一个全局 symbol 注册表中。Symbol.for() 并不是每次都会创建一个新的 symbol，它会首先检查给定的 key 是否已经在注册表中了。假如是，则会直接返回上次存储的那个。否则，它会再新建一个

```js
Symbol.for("bar") === Symbol.for("bar"); // true，证明了上面说的
```

### 遍历

常规的 for in，let of 的方式去取 ，比如 Object.entries,Object.keys，是拿不到 symbol 的值

使用 Object.getOwnPropertySymbols(obj) 。这种方式只拿到了 symbol 的变量的值

使用 Reflect.ownKeys(obj)

## this 绑定

this 绑定的优先级：new 绑定 > 显式绑定 > 隐式绑定 > 默认绑定。

## await

#### async 的传染性

比如一个函数用了 async，调用它的函数就要加上 async，有语法开销

#### 解决 aysnc/await 同一函数内无法执行并行的缺点

```js
async function selectPizza() {
  const pizzaData = await getPizzaData(); // async call
  const chosenPizza = choosePizza(); // sync call
  await addPizzaToCart(chosenPizza); // async call
}
async function selectDrink() {
  const drinkData = await getDrinkData(); // async call
  const chosenDrink = chooseDrink(); // sync call
  await addDrinkToCart(chosenDrink); // async call
}
(async () => {
  const pizzaPromise = selectPizza();
  const drinkPromise = selectDrink();
  await pizzaPromise;
  await drinkPromise;
  orderItems(); // async call
})()(
  // Although I prefer it this way
  async () => {
    Promise.all([selectPizza(), selectDrink()]).then(orderItems); // async call
  }
)();
```

## 装饰器

### vue2+ts

把类定义组件中的属性重组转换成 vue 能够解析的标准数据结构？这就需要靠 vue-class-component 中提供的 @component 装饰器来实现了。

装饰器的主要作用是：

收集类方法，分别进行处理后保存在 options 里。
收集实例方法，这里会对被装饰对类进行实例化，也就是在这会产生 Button 和 VueComponent 两个不同的实例。
将 options 传入 Vue.extend 方法，通过此方法，进行组件的扩展与继承。
复制类的静态方法到新的组件类上。
如果能使用 ReflectMateData 则使用 Reflect。
返回一个新的构造器。

## Promise

### Promise.any()

Promise.any() 方法是 Promise 并发方法之一。该方法对于返回第一个兑现的 Promise 非常有用。一旦有一个 Promise 兑现，它就会立即返回，因此不会等待其他 Promise 完成。

Promise.any() 会以第一个兑现的 Promise 来兑现，**即使有 Promise 先被拒绝**。这与 Promise.race() 不同，后者会使用第一个敲定的 Promise 来兑现或拒绝。

### Promise.allSettled()

静态方法将一个 Promise 可迭代对象作为输入，并返回一个单独的 Promise。当所有输入的 Promise 都已敲定时（包括传入空的可迭代对象时），返回的 Promise 将被兑现，并带有描述每个 Promise 结果的对象数组。

只关心是否都敲定，不关心结果

### Promise.all()

Promise.all() 静态方法接受一个 Promise 可迭代对象作为输入，并返回一个 Promise。当所有输入的 Promise 都被兑现时，返回的 Promise 也将被兑现（即使传入的是一个空的可迭代对象），并返回一个包含所有兑现值的数组。如果输入的任何 Promise 被拒绝，则返回的 Promise 将被拒绝，并带有第一个被拒绝的原因

### 作用域

Javascript 中的作用域说的是变量的可访问性和可见性。也就是说整个程序中哪些部分可以访问这个变量，或者说这个变量都在哪些地方可见。

let 和 const 声明变量才会创建一个新的词法环境存储，使用 var 声明的变量会被存储在当前块**所在的**词法环境中（全局词法环境或是函数词法环境中）。

Javascript 中有三种作用域：

1. 全局作用域；
2. 函数作用域；
3. 块级作用域；

词法作用域
词法作用域（也叫静态作用域）从字面意义上看是说作用域在词法化阶段（通常是编译阶段）确定而非执行阶段确定的。看例子

什么是词法环境
所谓词法环境就是一种标识符—变量映射的结构(这里的标识符指的是变量/函数的名字，变量是对实际对象[包含函数和数组类型的对象]或基础数据类型的引用)。
简单地说，词法环境是 Javascript 引擎用来存储变量和对象引用的地方。
注意：不要混淆了词法环境和词法作用域，词法作用域是在代码编译阶段确定的作用域(译者注：一个抽象的概念)，而词法环境是 Javascript 引擎用来存储变量和对象引用的地方(译者注：一个具象的概念)。

### 理解函数的执行过程

函数的执行过程分成两部分，一部分用来生成执行上下文环境，确定 this 的指向、声明变量以及生成作用域链；另一部分则是按顺序逐行执行代码。

- 建立执行上下文阶段(发生在 函数被调用时 && 函数体内的代码执行前 )
- 生成变量对象，顺序：创建 arguments 对象 --> 创建 function 函数声明 --> 创建 var 变量声明
- 生成作用域链
- 确定 this 的指向（注意此时才能确定 this 的指向）
- 函数执行阶段
- 逐行顺序执行代码，遇到赋值操作进行变量赋值，遇到函数调用进行函数引用调用，遇到条件判断和表达式进行条件判断和表达式计算等

一般来说静态作用域和 this 是一样的，但是存在特殊情况绑定了 this，导致出现不一样的结果
作者：幻灵尔依
链接：https://juejin.cn/post/6844903861153447950
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

### Object 和 Map

对象只允许键是字符串和 symbol。任何其他类型的键都会通过 toString 方法被隐含地转换为字符串。

用字面量创建对象时，这个对象不再是空的。

尽管 hashMap 是用一个空的对象字面量创建的，但它自动继承了 Object.prototype。这就是为什么我们可以在 hashMap 上调用 hasOwnProperty、toString、constructor 等方法。

我们可以通过使用 Object.create(null) 来解决这个问题，它可以生成一个不继承 Object.prototype 的对象。

Object 没有 size 的 api，想获得字符串和可枚举的键用 Object.keys();只想要不可枚举的字符串，用 Object.

getOwnPropertyNames();使用 getOwnPropertySymbols 获取 symbol 键；使用 Reflect.ownKeys 获取以上所有；对象只能使

用 for..in 不能使用 for...of, 但是 for...in 会读到继承的可枚举属性；

object 上的属性只能用 delete 操作符删除；不能通过.或者[]检查键是否存在，因为值可能为 undefined，

得使用 Object.prototype.hasOwnProperty 或 Object.hasOwn;

map 上有 clear

Map 比 Object 快，除非有小的整数、数组索引的键，而且它更节省内存。

如果你需要一个频繁更新的 hash map，请使用 Map；如果你想一个固定的键值集合（即记录），请使用 Object，并注意原型继承带来的陷阱。

### ESM

```js
// utils.js
const sum = (a, b) => a + b;
export default sum;
export function minus(a, b) {
  return a - b;
}

// index.js
import * as sum from "./utils";
// 如何调用相关函数
// sum.default(1, 2)
// sum.minus(1, 2)
```
