# js 输出题

## 对象+箭头函数

```js
var id = "GLOBAL";
var obj = {
  id: "OBJ",
  a: function () {
    console.log(this.id);
  },
  b: () => {
    console.log(this.id);
  },
};
obj.a(); // 'OBJ'

obj.b(); // 'GLOBAL'
//对象字面量加箭头函数，绑定不了对象this
//因为this绑定被放在对象外，作为全局语句执行

new obj.a(); // undefined
// 经过 new 操作，obj.a()的 this 被绑定为了新返回的实例
// 因此找不到 this.id

new obj.b(); // Uncaught TypeError: obj.b is not a constructor
// 而 obj.b()为箭头函数，无法被 new
```

## 作用域-obj 内部不能引用 obj

```js
var obj = {
  name: "1",
  fn: (function (x) {
    return x + 10;
  })(obj.name),
};
console.log(obj.fn); // 报错
```

第七行，去 obj 里面找 fn 函数，fn 为立即执行函数，先看参数，fn 立即执行函数的作用域为 obj 对象里面，obj 对象里面没有 obj，所有也没有 obj.name

## var+宏任务

```js
var i = 0;
for (i = 1; i <= 3; i++)
  setTimeout(function () {
    console.log(i);
  }, 0);
// 4 4 4
// 解释: 先执行完 for 循环, i 的值变为 4, 然后再执行宏任务

// 注意循环结束一定是循环限制条件以外，即4
```
