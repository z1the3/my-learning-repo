# js 输出题

## 1

经过 new 操作，obj.a()的 this 被绑定为了新返回的实例

因此找不到 this.id

而 obj.b()为箭头函数，无法被 new

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
new obj.a(); // undefined
new obj.b(); // Uncaught TypeError: obj.b is not a constructor
```

## 2.作用域-obj 内部不能引用 obj

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
