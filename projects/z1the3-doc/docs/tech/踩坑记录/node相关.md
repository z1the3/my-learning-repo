## 解决 \_\_dirname 无法在 esm 模块中使用

```js
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
```

## zsh: command not found

比如 jest,因为没设置到环境变量里

直接在终端中使用不可行，除非使用 npx

正确做法是在 package.json 的 script 中指定命令

或者 node jest 入口文件

## spawn error

若在`xxx`命令执行后出现

执行`which xxx`可发现指向文件不对
