# 作用域和 this

nodejs 环境下 fn 的 this 会指向 module.exports，而浏览器环境下指向 window

Javascript 中的作用域说的是**变量的可访问性和可见性**。也就是说整个程序中哪些部分可以访问这个变量，或者说这个变量都在哪些地方可见。

let 和 const 声明变量会创建一个新的词法环境存储！使用 var 声明的变量会被存储在当前块所在的词法环境中（全局词法环境或是函数词法环境中）。

Javascript 中有三种作用域：

1. 全局作用域；
2. 函数作用域；
3. 块级作用域；

## 词法作用域

词法作用域（也叫静态作用域！）从字面意义上看是说作用域在词法化阶段（通常是编译阶段）确定而非执行阶段确定的，因此叫静态作用域。看例子：

```js
let number = 42;
function printNumber() {
  console.log(number);
}
function log() {
  let number = 54;
  printNumber();
}
// Prints 42
log();
```

上面代码可以看出无论 printNumber()在哪里调用 console.log(number)都会打印 42。

但是这样不会触发暂时性死区

```js
function log() {
  console.log(a);
}
let a = 3;

log();
```

## 什么是词法环境

所谓词法环境就是一种标识符—变量映射的结构(这里的标识符指的是变量/函数的名字，变量是对实际对象[包含函数和数组类型的对象]或基础数据类型的引用)。
简单地说，词法环境是 Javascript 引擎用来存储变量和对象引用的地方。
注意：不要混淆了词法环境和词法作用域，词法作用域是在代码编译阶段确定的作用域(译者注：一个抽象的概念)，而词法环境是 Javascript 引擎用来存储变量和对象引用的地方(译者注：一个具象的概念)。
一个词法环境就像下面这样：

```js
lexicalEnvironment = {
  a: 25,
  obj: <ref. to the object>
}
```

只有当该作用域的代码被执行的时候，引擎才会为那个作用域创建一个新的词法环境。词法环境还会记录所引用的外部词法环境(即外部作用域)。

例如这里的 outer

```js
lexicalEnvironment = {
  a: 25,
  obj: <ref. to the object>
  outer: <outer lexical environemt>
}

```

## 理解函数的执行过程

函数的执行过程分成两部分，一部分用来生成执行上下文环境，确定 this 的指向、声明变量以及生成作用域链；另一部分则是按顺序逐行执行代码。
● 建立执行上下文阶段(发生在 函数被调用时 && 函数体内的代码执行前 )

1. 生成变量对象，顺序：创建 arguments 对象 --> 创建 function 函数声明 --> 创建 var 变量声明
2. 生成作用域链（静态）
3. 确定 this 的指向（注意此时才能确定 this 的指向）
   ● 函数执行阶段
4. 逐行顺序执行代码，遇到赋值操作进行变量赋值，遇到函数调用进行函数引用调用，遇到条件判断和表达式进行条件判断和表达式计算等

！！**一般来说静态作用域和 this 是一样的，但是存在特殊情况绑定了 this**，导致出现不一样的结果

> https://juejin.cn/post/6844904069413224462

> https://juejin.cn/post/6844903861153447950

## js 基本是静态作用域

出现动态作用域的情况是 eval 和 with

动态作用域性能
通过在运行时修改，或创建新的词法作用域，eval(..)和 with 都可以欺骗编写时定义的词法作用域。
JavaScript 引擎 在编译阶段期行许多性能优化工作。其中的一些优化原理都归结为实质上在进行词法分析时可以静态地分析代码，并提前决定所有的变量和函数声明都在什么位置，这样在执行期间就可以少花些力气来解析标识符。
但如果 引擎 在代码中找到一个 eval(..)或 with，它实质上就不得不 假定 自己知道的所有的标识符的位置可能是不合法的，因为它不可能在词法分析时就知道你将会向 eval(..)传递什么样的代码来修改词法作用域，或者你可能会向 with 传递的对象有什么样的内容来创建一个新的将被查询的词法作用域。
换句话说，悲观地看，如果 eval(..)或 with 出现，那么它 将 做的几乎所有的优化都会变得没有意义，所以它就会简单地根本不做任何优化。
你的代码几乎肯定会趋于运行的更慢，只因为你在代码的任何地方引入了一个了 eval(..)或 with。无论 引擎 将在努力限制这些悲观臆测的副作用上表现得多么聪明，都没有任何办法可以绕过这个事实：没有优化，代码就运行的更慢。

> https://juejin.cn/post/6844904199927365639

词法作用域
Lexical Scoping 作用域定义了变量的查找方法和权限，即查找路径。而词法作用域正如字面意思，它是在词法解析阶段定义的作用域，是一种静态作用域。换言之，在函数定义的时候就规定了该函数的作用域是什么。JavaScript 使用的是词法作用域。

变量对象 Variable Object A.K.A VO
一些作用域中的变量的集合。包括局部变量对象和全局变量对象。

活动对象 Activation Object A.K.A AO
当前执行作用域中的变量集合。其实就是激活的（活动的）变量对象。

作用域链 Scope Chain 函数有权访问的所有包含函数的局部变量对象（活动对象）和全局变量对象。

执行上下文 Execution Context 一段可执行代码的 VO、作用域链以及 this。即跟当前执行代码相关的所有环境上下文

## this 绑定

this 绑定的优先级：new 绑定 > 显式绑定 > 隐式绑定 > 默认绑定。
