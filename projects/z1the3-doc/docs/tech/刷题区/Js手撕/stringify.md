# JSON.stringify

    // 如果 value 是 string 类型，需要加上双引号！！

```js
function jsonStringify(object) {
  if (typeof object === "object" && object !== null) {
    if (Array.isArray(object)) {
      return (
        "[" +
        Object.keys(object)
          .map((i) => jsonStringify(object[i]))
          .join(",") +
        "]"
      );
    }
    // 为键值对
    return (
      "{" +
      Object.keys(object)
        .map((key) => `"${key}":${jsonStringify(object[key])}`)
        .join(",") +
      "}"
    );
  }
  if (typeof object === "string") {
    // 如果是 string 类型，需要加上“双引号”！！
    return `"${object}"`;
  }
  // 数字，null等
  return String(object);
}
```
