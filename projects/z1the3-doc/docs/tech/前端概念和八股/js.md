# js

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
