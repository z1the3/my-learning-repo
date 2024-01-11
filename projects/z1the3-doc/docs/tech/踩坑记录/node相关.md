## 解决 __dirname 无法在esm模块中使用
```js
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
```
