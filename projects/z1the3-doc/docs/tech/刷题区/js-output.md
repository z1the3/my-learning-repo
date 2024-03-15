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

## 原型链

```js
function Person(name) {
  this.name = name;
}
var p2 = new Person("king");
console.log(p2.__proto__); //Person.prototype
console.log(p2.__proto__.__proto__); //Object.prototype
console.log(p2.__proto__.__proto__.__proto__); // null
console.log(p2.__proto__.__proto__.__proto__.__proto__); //null后面没有了，报错
console.log(p2.__proto__.__proto__.__proto__.__proto__.__proto__); //null后面没有了，报错
console.log(p2.constructor); //Person
console.log(p2.prototype); //undefined p2是实例，没有prototype属性
console.log(Person.constructor); //Function 一个空函数
console.log(Person.prototype); //打印出Person.prototype这个对象里所有的方法和属性
console.log(Person.prototype.constructor); //Person
console.log(Person.prototype.__proto__); // Object.prototype ****
console.log(Person.__proto__); //Function.prototype
console.log(Function.prototype.__proto__); //Object.prototype
console.log(Function.__proto__); //Function.prototype
console.log(Object.__proto__); //Function.prototype
console.log(Object.prototype.__proto__); //null  ******
```

除了 Object.prototype，所有 prototype 的 proto 都是 Object.prototype

所有构造函数的 proto 都是 Function 的 prototype

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
