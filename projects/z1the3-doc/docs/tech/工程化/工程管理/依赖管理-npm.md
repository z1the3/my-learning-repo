---
tags: [npm]
---

# Npm

## 全局安装包

默认情况下，npm 安装的全局包，会保存在`C:\Users\username\AppData\Roaming\npm\node_modules`，可以使用`npm root -g`查看全局包安装路径。

`npm list -g --depth=0`

`yarn global list --depth=0`

## npx

如果有些包我们**只会使用一次，或者只想尝试一下**，不想安装到全局，也不想作为当前项目的依赖
可以使用 npx 的方式来执行

npx 是 npm 5.2+ 版本之后自带的工具，能够帮助我们更高效的**执行 npm 软件仓库里的安装包**

- 可以用来执行**当前项目中甚至当前项目依赖中**的可执行工具

```
# npx 之前
$ node ./node_modules/.bin/mocha

# 使用 npx:
$ npx mocha

```

- 也可直接执行那些不在当前项目，也没在全局安装过的 npm 工具包，比如：create-react-app

```
npx create-react-app my-app
```

执行以上这条命令 npx 会按以下顺序工作：

1. 先查看当前项目有没 create-react-app
2. 如果当前项目找不到，会去全局查找 create-react-app
3. 如果全局还找不到，会帮我们**临时从 npm 包仓库安装 create-react-app，不会污染到当前项目，也不会装到全局**

## npm install

--save 指安装为依赖（生产环境）；--save-dev 指安装为 dev 依赖（开发环境）；--save-exact 是使用精确版本安装；--force 是指强制安装

## prepare

关于 husky install 官网推荐的是在 packgae.json 中添加 prepare 脚本
，prepare 脚本会在 npm install（不带参数）之后自动执行。

这样少输一次命令，相当于把脚手架初始化命令放到 npm install 中

```
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

## 其他

package-lock.json 的作用以及安装顺序: 如果与 package.json 冲突, 以 package.json 为准

## npm package

什么是 package
在 npm 中，package 是一个用 package.json 来描述的文件。 其中 package.json 中定义了包的名称（name）、版本（version）等信息，其他文件往往为源代码及相关的说明文档。当这些信息通过 npm publish 上传后，将产生一个 gzip 的压缩包，通常称为 tar 包（.tgz）
当我们装包时在装什么
这里以 react@18.0.0 为例。在执行 npm install react@18.0.0 时，本质上下载的是 react-18.0.0.tgz 这个压缩文件。文件下载解压后目录结构如下。

```json
$ tree react-18.0.0
react-18.0.0
├── LICENSE
├── README.md
├── cjs
├── index.js
├── jsx-dev-runtime.js
├── jsx-runtime.js
├── package.json
├── react.shared-subset.js
└── umd

2 directories, 20 files
```

可以看到除 package.json 文件外，其他均为 React 生成的目标代码，同时还有 READEME.md 和 LICENSE 等说明文件。
package.json
理论上，当一个 package.json 中包含合法的 name 和 version 字段时， npm CLI 和 npm registry 就认为当前执行环境是一个合法的 npm package。比如我们可以通过新建一个文件夹，仅仅在 package.json 中写入 name 和 version 字段，执行 npm publish，npm 并不会阻止发布

```json
// package.json
{ "name": "@bnpm-test/example", "version": "1.0.0" }
```

显然，我们非常不推荐通过上述方式发布你的 npm package。具体原因我们在后面阐述，我们先将核心的 package.json 字段来描述下。当我们在命令行中执行 npm init -y 时， npm 默认会在当前目录生成一份 package.json 文件，包含了以下字段

```json
{
  "name": "@bnpm-test/example",
  "version": "1.0.0","main": "index.js",
  "scripts":
  {
    "test": "echo "Error: no test specified" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}
```

### package 必要字段

#### name

表示当前 npm package 的包名，**包名不宜过长，必须 `<=214 个字符`，包含 scope 的长度**

#### scripts

脚本文件，通常为 npm run 时使用，非必要情况下，在 npm package 中合理使用依赖项，避免 postinstall/install/prepare 等 hook 脚本

#### keywords

关键词，有利于包搜索的 SEO，助于你更好的搜索到 npm package

#### author

包的作者，标注包的出处，当包产生问题时可以便于联系

#### license

包的许可证，表示包的开源许可，通常来讲，开源软件大部分为 MIT，更多相关的 license 可以自行查找 wiki，这里不展开解释。

#### description

描述信息，有利于包搜索的 SEO，助于你更好的搜索到 npm package

### package 重要字段

#### repository

表示源代码出处，方便其他使用者研究和学习，也利于 npm 分析当前 package 的维护情况

#### homepage

如果你的 package 有对应的预览页面的话，比如 antd 的组件库文档，可以填写该字段

#### publishConfig

发布配置，比如 registry，你可以在 publishConfig 中设置，则不需要每次拼写 --registry 参数，一切在 npm config 中的配置，都可以在 publishConfig 中配置

#### config

npm 自定义配置参数，例如配置端口号 config.port: 8080，该 config 具有一定的特殊性，即可以在 npm scripts 中获取其值，我常常用他将前置的一些运行命令组装，使得 script 很“干净”。比如你定义了 config.doas = "doas -p p.s.m"，可以在 scripts.dev 命令中如下书写 "$npm_package_config_doas node index.js"，而不是每次都手工 doas -p p.s.m npm run dev 或者在 dev 命令中拼写一堆前缀操作

## 什么是 scope

Scope 在实际应用上，往往表示一个组织所管理的 pacakge，例如 @babel，表示 babel 开源组织下的 package。
从用户角度来讲，如果你用过 @babel 的其他 package，再次使用一个新的以 @babel scope 为前缀命名的包时，往往会觉得这个 package 比较可靠，且维护性高。

## 引用

原文作者：z\_\_r
转自链接：https://learnku.com/articles/16798/quick-view-of-npm-and-yarn-global-installed-packages
版权声明：著作权归作者所有。商业转载请联系作者获得授权，非商业转载请保留以上作者信息和原文链接。
