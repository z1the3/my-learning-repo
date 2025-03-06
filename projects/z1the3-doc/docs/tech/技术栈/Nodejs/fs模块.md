# fs 模块

先引用模块

```js
const fs = require("fs");
```

## fs.readFile(path,格式,callback)

```js
const demoFilePath = "./demo.txt"; // 读取demo文件
fs.readFile(demoFilePath, "utf8", (err, data) => {
  // 参数error
  if (err) {
    console.error("读取demo文件时出错:", err);
    return;
  }
});
```

## fs.watch 监听文件变动

`fs.watch(filename[, options][, listener])`

监视 filename 的变化，其中 filename 是文件或目录。

无法深层检测目录中内容改变

监听器回调有两个参数 (eventType, filename)。 eventType 是 'rename' 或 'change'，filename 是触发事件的文件的名称。

在大多数平台上，只要目录中文件名出现或消失，就会触发 'rename'。

新增和删除文件触发的是 rename 事件
