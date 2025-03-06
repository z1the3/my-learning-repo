# readline 模块

```js
const readline = require("readline");
```

## 输入输出

```js
// 命令行部分
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
```

## readline.prototype.question(text,callback)

```js
function askForKey() {
  rl.question("请输入密钥: ", (key) => {
    ask(key);
    // 嵌套使用
    rl.question("请再次输入:", (key) => {
      console.log(key);
    });
  });
}
```
