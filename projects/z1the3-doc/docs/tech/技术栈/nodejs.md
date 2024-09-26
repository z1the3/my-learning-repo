# NodeJS

## 有用链接

- NodeJs 中文文档 https://nodejs.cn/api/
- 平滑版 https://doc.cherrychat.org/node/

## util

### 字符串占位（格式化）

`util.format(format[, ...args])`

```js
util.format("%s:%s", "foo");
// Returns: 'foo:%s'

util.formatWithOptions({ colors: true }, "See object %O", { foo: 42 });
// Returns 'See object { foo: 42 }', where `42` is colored as a number
// when printed to a terminal.
```

option 配置对象https://nodejs.org/docs/latest/api/util.html#utilinspectobject-options

返回：格式化字符串

https://nodejs.org/docs/latest/api/util.html#utilformatformat-args
