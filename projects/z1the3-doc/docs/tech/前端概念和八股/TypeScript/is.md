# is 关键字

is 关键字其实更多用在函数的返回值，返回值+is 类型上，用来表示对于函数返回值的类型保护。

```js
function isString(test: any): test is string {
  return typeof test === 'string';
}

function example(foo: any) {
// 收窄类型
  if (isString(foo)) {
    console.log(`it is a string${foo}`);
    console.log(foo.length); // string function
    console.log(foo.toExponential(2));
  }
}
example('hello world');

```

- 类型保护的作用域仅仅在 if 后的块级作用域中生效
