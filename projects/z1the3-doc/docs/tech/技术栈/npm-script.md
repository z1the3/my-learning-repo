---
tags: [npm]
---

# Npm 命令

## 全局安装包

默认情况下，npm安装的全局包，会保存在`C:\Users\username\AppData\Roaming\npm\node_modules`，可以使用`npm root -g`查看全局包安装路径。

`npm list -g --depth=0`

`yarn global list --depth=0`

## npx

如果有些包我们**只会使用一次，或者只想尝试一下**，不想安装到全局，也不想作为当前项目的依赖
可以使用 npx 的方式来执行

npx 是 npm 5.2+ 版本之后自带的工具，能够帮助我们更高效的**执行 npm 软件仓库里的安装包**

* 可以用来执行**当前项目中甚至当前项目依赖中**的可执行工具

```
# npx 之前
$ node ./node_modules/.bin/mocha

# 使用 npx:
$ npx mocha

```

* 也可直接执行那些不在当前项目，也没在全局安装过的 npm 工具包，比如：create-react-app

```
npx create-react-app my-app
```

执行以上这条命令 npx 会按以下顺序工作：

1. 先查看当前项目有没 create-react-app
2. 如果当前项目找不到，会去全局查找 create-react-app
3. 如果全局还找不到，会帮我们**临时从 npm 包仓库安装 create-react-app，不会污染到当前项目，也不会装到全局**

## npm install

--save 指安装为依赖（生产环境）；--save-dev指安装为dev依赖（开发环境）；--save-exact是使用精确版本安装；--force是指强制安装

## 引用

原文作者：z__r
转自链接：<https://learnku.com/articles/16798/quick-view-of-npm-and-yarn-global-installed-packages>
版权声明：著作权归作者所有。商业转载请联系作者获得授权，非商业转载请保留以上作者信息和原文链接。
