# typeof(可判断 null 和 引用类型的实例)

.slice(8, -1) 的含义是截取字符串中从第 8 个字符到倒数第 1 个字符之间的部分。也就是说它会去掉字符串开头的 "[object " 和结尾的 "]"，只返回中间的类型部分。

```js
function getType(value) {
  // 判断数据是 null 的情况,返回字符串null
  if (value === null) {
    return value + "";
  }
  // 判断数据是引用类型的情况
  if (typeof value === "object") {
    let valueClass = Object.prototype.toString.call(value),
      // 去掉[object Array]的[object
      type = valueClass.split(" ")[1].split("");
    // 去掉]
    type.pop();
    return type.join("").toLowerCase();
  } else {
    // 判断数据是基本数据类型的情况和函数的情况
    return typeof value;
  }
}
```
