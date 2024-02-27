# js 输出题

## 1

经过new操作，obj.a()的this被绑定为了新返回的实例

因此找不到this.id

而obj.b()为箭头函数，无法被new

```js
var id = 'GLOBAL';
var obj = {
  id: 'OBJ',
  a: function(){
    console.log(this.id);
  },
  b: () => {
    console.log(this.id);
  }
};
obj.a();    // 'OBJ'
obj.b();    // 'GLOBAL'
new obj.a()  // undefined 
new obj.b()  // Uncaught TypeError: obj.b is not a constructor

```
