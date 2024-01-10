# NodeJS

## 有用链接

* NodeJs中文文档 https://nodejs.cn/api/


## fs模块

### 监听文件变动
`fs.watch(filename[, options][, listener])`

监视 filename 的变化，其中 filename 是文件或目录。

无法深层检测目录中内容改变

监听器回调有两个参数 (eventType, filename)。 eventType 是 'rename' 或 'change'，filename 是触发事件的文件的名称。

在大多数平台上，只要目录中文件名出现或消失，就会触发 'rename'。

新增和删除文件触发的是rename事件


## util

### 字符串占位（格式化）

`util.format(format[, ...args])`

```js
util.format('%s:%s', 'foo');
// Returns: 'foo:%s'

util.formatWithOptions({ colors: true }, 'See object %O', { foo: 42 });
// Returns 'See object { foo: 42 }', where `42` is colored as a number
// when printed to a terminal.
```

option配置对象https://nodejs.org/docs/latest/api/util.html#utilinspectobject-options

返回：格式化字符串

https://nodejs.org/docs/latest/api/util.html#utilformatformat-args