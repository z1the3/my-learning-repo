# AOP

> 一句话：让程序员可以将不同关注点的代码片段封装成不同的切面，在需要的时候将它们动态地插入到目标方法的执行过程中，从而实现对目标方法进行增强的效果。

AOP（面向切面编程）和动态代理密不可分。简单来说，动态代理是实现 AOP 的核心技术之一，它可以帮助开发人员更方便地实现切面对目标类的透明增强。

AOP 通过在特定的执行点（连接点）插入代码，来实现横向的关注点功能，例如日志、安全性、事务等。而动态代理则负责将切面透明地织入目标对象的方法调用中，以实现对目标对象的透明增强，从而实现 AOP 的编程范式。

在 JavaScript 中实现函数调用前和调用后执行某个方法的方式，可以使用 AOP（面向切面编程）的思想。具体实现方式是，使用一个函数对目标函数进行包装，然后在原始函数调用前或调用后进行相关操作。

## 实现

```js
Function.prototype.before = function (beforeFn) {
  const self = this; // 保存原函数的引用
  return function () {
    // 返回包含原函数和前置函数的新函数
    beforeFn.apply(this, arguments);
    return self.apply(this, arguments);
  };
};

Function.prototype.after = function (afterFn) {
  const self = this; // 保存原函数的引用
  return function () {
    // 返回包含原函数和后置函数的新函数
    const result = self.apply(this, arguments);
    afterFn.apply(this, arguments);
    return result;
  };
};
```

在上述代码中，我们先给 Function 原型添加了两个方法：before 和 after，这两个方法都接受一个函数作为参数。

before 函数会返回一个新函数，这个新函数会先调用传入的 beforeFn 函数，然后再调用原始函数，并将原始函数的返回值返回出去。

after 函数同样会返回一个新函数，这个新函数会先调用原始函数，然后再调用传入的 afterFn 函数，并将原始函数的返回值返回出去。

从输出结果可以看出，在 greet 函数执行前后，我们都成功地添加了一些额外的操作，这就体现了 AOP 的优势

## 终极方案：装饰器

JavaScript 中的装饰器是一种特殊的函数，它可以用来修改类或对象的行为。装饰器可以在不修改原始类或对象定义的情况下，动态地添加、删除或修改它们的属性和方法。

装饰器可以被用来解决很多问题，比如增加验证、日志记录、性能分析等功能，这些功能可以通过在类或对象的定义上应用不同的装饰器来实现。使用装饰器可以让代码具有更好的可维护性和可扩展性。

通常情况下，装饰器可以在函数、类、类成员上应用。

```js
// 定义一个装饰器，它接收一个目标对象和一个方法名
function log(target, name, descriptor) {
  const original = descriptor.value; // 取出原有的方法
  if (typeof original === "function") {
    // 如果它确实是一个函数
    descriptor.value = function (...args) {
      // 用新的函数替代原有的方法
      console.log(`Calling ${name} with`, args); // 记录日志
      const result = original.apply(this, args); // 调用原有的方法，并拿到它的返回值
      console.log(`Result is`, result); // 记录返回值
      return result; // 将返回值传递给调用者
    };
  }
  return descriptor; // 返回修改后的方法描述符
}

// 定义一个类，其中有一个需要记录日志的方法
class Calculator {
  @log
  add(a, b) {
    return a + b;
  }
}

// 创建一个新的计算器实例，并调用它的 add 方法
const calculator = new Calculator();
const result = calculator.add(2, 3);
console.log(`Result is`, result);
```

## 使用场景

AOP 的使用场景主要有以下几点：

- 日志记录：在方法执行前后打印调用日志，方便排查错误。
- 权限控制：对方法进行拦截，判断用户是否有执行该方法的权限。
- 缓存：对于需要大量计算的方法，添加缓存功能，来减少计算次数。
- 异常处理：对于系统中出现的异常情况，可以通过 AOP 机制进行统一处理，避免代码中出现大量的 try/catch 块。
- 事务管理：对于需要进行事务管理的方法，可以通过 AOP 机制实现事务的自动开启、提交和回滚。

## AOP 的优点

- 模块化：AOP 可以将整个应用程序分为多个模块，方便错误处理和修改。
  可复用性高：

- 易于维护：切面可以帮助程序员更加清晰地看到代码的执行流程，降低维护成本。

- 关注点分离：使用 AOP 可以将业务逻辑与非核心功能进行分离，使代码更加简洁，易于维护和修改。
- 代码重用性：多个组件可以共享同一个切面，实现了代码的重用和模块化,切面可以跨越多个模块的代码进行修改，使得修改变得更加容易

- 动态代理：AOP 动态创建代理对象并将其调用目标对象，实现了对目标对象的透明增强。

- 统一管理：通过 AOP 机制对系统中的关注点进行统一管理，避免代码冗余和维护复杂性。

## AOP 的缺点

- 增加了代码复杂度：AOP 通过增加切面来实现其功能，会增加代码的复杂度。

- 运行效率：AOP 在运行时动态地创建代理对象和增强方法，可能会对系统的性能产生一定的影响。

- 学习成本：AOP 需要使用特定的框架或库来实现，需要花费一定的时间学习和掌握。

- 调试困难：由于 AOP 可以对目标对象进行透明增强，调试和排查问题时可能会产生一定的困难。

## 参考

https://zhuanlan.zhihu.com/p/628410789
