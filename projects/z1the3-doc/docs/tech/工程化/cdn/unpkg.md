# unpkg

UNPKG
UNPKG 是通过拼接 URL 获取当前 tarball 代码文本内容的方案。
当 package.json 中存在 unpkg 字段时，表示用户需要将 package 的 tarball 解压上传至公网（外网） CDN。如果你有公网通过浏览器访问的 package 内容的需求，可以考虑使用此特性。另外，注意代码中禁止包含内网资源。

## 应用

shadow DOM

```js
const shadow = document
  .querySelector("#hostElement")
  .attachShadow({ mode: "open" });
shadow.innerHTML =
  '<sub-app>Here is some new text</sub-app><link rel="stylesheet" href="//unpkg.com/antd/antd.min.css">';
```
