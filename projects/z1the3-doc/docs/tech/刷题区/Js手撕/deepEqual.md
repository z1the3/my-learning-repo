# Deep Equal

对象深比较

```js
function deepEqual(obj1, obj2) {
  // 如果两个参数不是对象类型，直接比较即可
  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return obj1 === obj2;
  }
  if (obj1 === null && obj2 === null) {
    return true;
  }
  // 如果两个参数是对象类型，但有一个是 null，直接返回 false
  if (obj1 === null || obj2 === null) {
    return false;
  }
  // 如果两个参数的属性个数不相等，返回 false
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  // 递归比较每个属性
  for (let key in obj1) {
    // 如果 obj2 没有 obj1 的属性，返回 false
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }
    // 递归比较 obj1 和 obj2 的同名属性
    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  // 所有属性都相等，返回 true
  return true;
}
```
