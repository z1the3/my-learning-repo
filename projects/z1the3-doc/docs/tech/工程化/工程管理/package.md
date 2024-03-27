# package 和 package.json

不同于 module，package 往往是大量 module 的集成

它能作为 Package 存在，最为显著的特征是 package.json 文件

（不一定要发包到 npm 官方上，本地也可以使用）

在 npm 中，package 是一个用 package.json 来描述的文件。 其中 package.json 中定义了包的名称（name）、版本（version）等信息，其他文件往往为源代码及相关的说明文档。当这些信息通过 npm publish 上传后，将产生一个 gzip 的压缩包，通常称为 tar 包（tarball）

## 当我们装包时在装什么

这里以 react@18.0.0 为例。在执行 npm install react@18.0.0 时，本质上下载的是 react-18.0.0.tgz 这个压缩文件。文件下载解压后目录结构如下。

包含了源代码和说明性文档（开源 LICENSE，readme）之类的

```

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

## package.json

理论上，当一个 package.json 中包含合法的 name 和 version 字段时， npm CLI 和 npm registry 就认为当前执行环境是一个合法的 npm package。比如我们可以通过新建一个文件夹，仅仅在 package.json 中写入 name 和 version 字段，执行 npm publish，npm 并不会阻止发布。

```
// package.json
{"name": "@bnpm-test/example","version": "1.0.0"
}
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

## 打包成两种格式

打包成两种格式就是为了让自己的库有更好的兼容性，使用者可以根据情况来选择使用 esm 还是 cjs。那么如何配置发包配置呢？
在 package.json 文件中，"exports"、"module" 和 "main" 字段有着不同的作用。

"exports" 字段是在 Node.js 版本 12 及以上引入的，它用于指定模块的导出方式。导入模块时应该使用 cjs 还是 esm 取决于使用时的导入语法。
"module" 字段是在 Node.js 版本 8 及以上引入的，它用于指定 ES 模块的入口文件路径。在使用支持 ES 模块的环境中，例如现代浏览器或 Node.js 版本 13 及以上，这个字段可以用来指定默认的模块入口。
"main" 字段是 Node.js 中常用的字段，它用于指定 CommonJS 模块的入口文件路径。在使用 CommonJS 模块的环境中，例如 Node.js 版本 12 及以下，这个字段可以用来指定默认的模块入口。

**export 优先级最高，其次是 Module 和 main**

```json title="package.json"
{
    "main": "lib/cjs/index.js",
    "module": "lib/esm/index.mjs"
    "typings": "lib/cjs/types/index.d.ts",
    "exports": {
      ".": {
        // 使用import语句，则types的入口在 /lib/esm/types/index.d.mts
        // default 为项目入口文件
        "import": {
          "types": "./lib/esm/types/index.d.mts",
          "default": "./lib/esm/index.mjs"
        },
        "require": {
          "types": "./lib/cjs/types/index.d.ts",
          "default": "./lib/cjs/index.js"
        }
      }
    }
}


```

如果只有 umd,"main"字段可以配 umd，umd 是 cjs 的超集

```
  "main": "dist/axios.umd.js",
```

## 关于包 size 的概念

### install size

包安装时包括各个依赖的 size

对 serverless 应用有重要用处

### package size

包括包中 md 和 example 文件等杂七杂八的 size

### bundle size

实际被引用后，打包成 bundle 后的 size

## 引用

原文作者：z\_\_r
转自链接：https://learnku.com/articles/16798/quick-view-of-npm-and-yarn-global-installed-packages
版权声明：著作权归作者所有。商业转载请联系作者获得授权，非商业转载请保留以上作者信息和原文链接。
