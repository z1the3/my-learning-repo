# eval 和 new Function 的 this 指向问题

eval 的 this 指向可以看这篇，很详细：
https://ayk.moe/articles/javascript-change-this-in-eval-function/index.html

简单的说：eval 函数只要是在全局直接运行或者是通过一个函数调用执行、作为对象属性被调用执行这种间接的执行方式，他的指向都是全局作用域。他不能直接被 call/bind/apply 改变 this 指向，改变的思路是在 eval 外面包一层函数，改变外面这个函数的 this 指向。

new Function：使用 new Function 创建的函数，它的 `[[Environment]]` 指向全局词法环境，而不是函数所在的外部词法环境。因此，我们不能在 new Function 中直接使用外部变量。

如果你对这块不熟悉，来看看这个：https://zh.javascript.info/new-function

作者：lxylxy\_
链接：https://www.nowcoder.com/?type=818_1
来源：牛客网
