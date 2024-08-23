# Object

## 对象浅拷贝

```js
let a = {
  name: "ccc",
};
let b = Object.assign(a);
let c = b;
console.log(a === b); //false
console.log(b === c); //true
console.log(a === c); //false
```
