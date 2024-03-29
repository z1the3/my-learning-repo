# monorepo 实践

基于 pnpm workspace

# 1.新建仓库

目录下执行`pnpm init`

# 2.指定项目 node 版本和 pnpm 版本

为了减少因 node 或 pnpm 版本的差异而产生开发环境错误

在`package.json`中增加`engines`字段来限制版本

```
  "engines": {
    "node": ">=18.0",
    "pnpm": ">=8.0"
  }

```

# 3.防止根目录被当作**包**发布

`package.json`下增加

```
{
  "private": true
}
```

还可以防止业务模块被发布

主要就这两个用处

# 4.根目录下加入 pnpm-workspace.yaml

```yaml
packages:
  # all packages in direct subdirs of projects & learning-demo
  - "projects/*"
  - "learning-demo/*"
```

# 5.安装全局依赖包

全局依赖包安装到根目录

常用的编译依赖包：rollup, execa, chalk, enquirer, fs-extra, minimist,
npm-run-all, typescript

-w 表示在 workspace 的根目录下安装而不是当前目录
-D 表示 devDependencies

-Dw

```
pnpm add typescript -Dw
```

根目录下安装的依赖可以被子目录使用，一般都是开发用依赖

实际依赖由子目录自身管理并使用

删除依赖包可用

```
pnpm rm/remove
pnpm un/uninstall
```

# 安装子包依赖

对于局部依赖，最简单的办法就是 cd packages/http
pnpm install axios
参照 pnpm 官网提供了根目录执行的命令
首先切到指定包 http 进行 pnpm init -y 初始化,包名一般都通用为命名空间+项目名，这里命名为@monorepo/http,必须要命名，不然 pnpm add --filter 的时候找不到添加包的项目目录
pnpm add express --filter @monorepo/http

# 安装项目内互相依赖

比如 web 需要依赖 http 的功能用于请求，那么这个时候需要互相依赖,为了让依赖实时更新最新版本，才用通配符更新版本

pnpm add @monorepo/http@\* --filter @monorepo/web

workspace 加通配符是局部依赖，pnpm publish 会转成真实路径依赖 通过上面的模式基本的组件库的基本模型就搭建上.

# 启动子项目

```
pnpm -C <workspace-name> <command>

pnpm -C projects/z1the3-doc start
```

作者：神说要有光\_zy
链接：https://juejin.cn/post/7055281852789047304
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
