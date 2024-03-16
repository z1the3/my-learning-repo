# 模块联邦

Module Federation[1]官方称为模块联邦，模块联邦是 webpack5 支持的一个最新特性，多个独立构建的应用，可以组成一个应用，这些独立的应用不存在依赖关系，可以独立部署，官方称为微前端。

现在假设 application-a 项目有一个组件是 Example,假设 application-b 中也有一个组件需要这个组件 Example
我们之前的做法就是把 a 项目的 Example 拷贝到 b 项目中，如果这个 Example 组件有依赖第三方插件，那么我们在 b 项目也需要安装对应的第三方插件，而且有一种场景，就是哪天这个 Example 组件需要更新了，那么两个应用得重复修改两次。
于是你想到另外一种方案，我是不是可以把这个独立的组件可以抽象成一个独立的组件仓库，用 npm 去管理这个组件库，而且这样有组件的版本控制，看起来是一种非常不错的办法。

## MDF 解决的问题

webpack5 升级了，module Federation 允许一个应用可以动态的加载另一个应用的代码，而且共享依赖项
现在就变成了一个项目 A 中可以动态加载项目 B，项目 B 也可以动态加载项目 A,A 应用的任何应用可以通过 MFD 共享给其他应用使用。

```json
 ...
 plugin: [
     new ModuleFederationPlugin({
      name: 'application_b',
      library: { type: 'var', name: 'application_b' },
      filename: 'remoteEntry.js',
      exposes: {
        './Example': './src/compments/Example',
        './Example2': './src/compments/Example2',
      },
      ...
    }),
 ]

```

在 html 中引入 remoteEntry.js
由于我需要在 application-a 中使用 application-b 暴露出来的组件

因此我需要在 application-a 的模版页面中引入

```html
<!--application-a/public/index.html-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>application-a</title>
    <script src="http://localhost:8082/remoteEntry.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

作者：Maic
链接：https://juejin.cn/post/7117055274682155038
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
