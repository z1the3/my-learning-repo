var name = "window";

var person = {
  name: "person",
  sayName: function () {
    console.log(this.name);
  }
};

function sayName() {
  var sss = person.sayName;
  sss(); // "window"
  // this绑定
  person.sayName(); // "person"
  // 这与 person.sayName(); 本质上是相同的。括号不会改变上下文，因此 this 仍然指向 person，结果是 "person"。
  (person.sayName)(); // "person"
  //这里，b 被赋值为 person 对象的 sayName 方法，类似于第一种情况。当调用 (b)() 时，它作为一个独立的函数被调用，因此 this 默认指向全局对象，结果是 "window"。
  (b = person.sayName)(); // "window"
}

sayName();



var name = 'window'

function Person(name) {
  this.name = name
  this.obj = {
    name: 'obj',
    foo1: function () {
      return function () {
        console.log(this.name)
      }
    },
    foo2: function () {
      return () => {
        console.log(this.name)
      }
    }
  }
}

var person1 = new Person('person1')
var person2 = new Person('person2')

// 闭包返回普通函数，this为window；
person1.obj.foo1()() // 'window'
person1.obj.foo1.call(person2)()  // 'window'
// 返回完普通函数再call，能修改
person1.obj.foo1().call(person2) // 'person2'

// 闭包返回箭头函数，this为上下文obj；
person1.obj.foo2()() // 'obj'
// foo2被call，this上下为被改为person2
person1.obj.foo2.call(person2)() // person2
// 箭头函数被call，this上下文无法被修改为person2
person1.obj.foo2().call(person2) // obj
