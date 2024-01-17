## 解决 __dirname 无法在esm模块中使用
```js
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
```


## zsh: command not found
比如jest,因为没设置到环境变量里

直接在终端中使用不可行，除非使用npx

正确做法是在package.json的script中指定命令

或者node jest入口文件