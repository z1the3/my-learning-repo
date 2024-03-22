# api

## String

### String.prototype.padStart()

```js
const str1 = "5";

console.log(str1.padStart(2, "0"));
// Expected output: "05"

const fullNumber = "2034399002125581";
const last4Digits = fullNumber.slice(-4);
const maskedNumber = last4Digits.padStart(fullNumber.length, "*");

console.log(maskedNumber);
// Expected output: "************5581"
```

## 对象

### 对象遍历

对象的遍历方法

1、for...in...
遍历对象的 key 值
for...of...若想实现对象的遍历，需要手动实现迭代器 Symbol.iterator 属性

2、object.keys
(返回一个数组,包括对象自身的(不含继承的)所有可枚举属性(不含 Symbol 属性).).
通过返回的数组，再使用 forEach 遍历

3、object.values
返回的是 value 值数组

4、object.entries
返回的是 key 与 value 的二维数组

5、Object.getOwnPropertyNames(obj)
返回一个数组,包含对象自身的所有属性(不含 Symbol 属性,但是包括不可枚举属性).

6、Reflect.ownKeys(obj)
返回一个数组,包含对象自身的所有属性,不管属性名是 Symbol 或字符串,也不管是否可枚举.
