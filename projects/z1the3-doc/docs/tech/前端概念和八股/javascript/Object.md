# Object

## Object 的原型方法

1. constructor
2. hasOwnProperty(propertyName)
3. isPrototypeOf
4. propertyIsEnumberalbe
5. toLocaleString
6. toString
7. valueOf

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
