# 配置

vue.config.js

## publicPath

会影响最后页面打包后标签上的路径

```
<link href="{publicPath}/xxx.js">
```

千万不要用相对路径，比如`./`

否则页面进入路由/a 后，资源会去`/a/xxx.js`下找
