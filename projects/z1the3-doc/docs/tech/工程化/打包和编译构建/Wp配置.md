# Webpack 配置

- Output:配置如何输出最终想要的代码
- Module:配置处理模块的规则
- Resolve:配置寻找模块的规则
- Plugins:配置扩展插件
- DevServer: 配置 DevServer

## entry

模块的入口，从此处进行搜寻和递归解析
该配置必填，否则会报退出

### 参数

#### 只会生成一个 chunk，名称为 main

- string 入口模块的路径，可以是相对路径 `./app/entry`
- array 配合 output.library 使用时，只有数组里的最后一个入口文件的模块会被导出

#### 可能会生成 chunk，名称为 key 名

- object 配置多个入口，每个入口生成一个 chunk`{a: './app/a',b:'./app/b'}`

### 异步 entry

```js
entry: () => {
  {
    return new Promise((resolve) => {
      // 配置镀锡
      resolve({});
    });
  }
};
```

### context

wp 寻找相对路径的文件会用 context 为根目录
默认为执行启动 webpack 时所在的工作目录

```js
module.exports = {
  context: path.resolve(__dirname, "app"),
};
```

context 必须是一个绝对路径的字符串

## format

> 默认打包格式是 IFE

通过 format 可以配置输出 umd,cjs 还是 esm

## 配置 sourcemap

不同版本 webpack 不一样，需要看详细文档

```js
    optimization: {    // 1. 这个配置必须
        minimize: false
    },
    devtool: "source-map" // 2. 这个配置必须
```

## publicPath

会影响最后页面打包后标签上的路径

```
<link href="{publicPath}/xxx.js">
```

千万不要用相对路径，比如`./`

否则页面进入路由/a 后，资源会去`/a/xxx.js`下找

## externals

在 Webpack 中使用 externals 配置一个包时，该包不会被打包到最终的输出文件中，而是被视为外部依赖。因此，externals 配置的包本身不会有 hash 值，因为它不参与 Webpack 的打包过程。

由于 externals 的包不在打包范围内，Webpack 不会对其进行任何处理或生成 hash 值，因此它的内容变化不会影响 Webpack 输出文件的 hash 值。

防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。

例如，从 CDN 引入 jQuery，而不是把它打包
这样就剥离了那些不需要改动的依赖模块

## output

### filename

配置输出文件的名称

可以动态设置
`[name].js`

即用 chunk 名称作为输出文件名称

#### 其他支持的变量

- id：唯一标识，从 0 开始
- hash 唯一标识，是 hash 值
- chunkhash chunk 内容的 hash

hash 和 chunkhash 的长度可指定
`[hash:8]`代表取 8 位 hash，默认是 20 位

注意 ExtractTextWebpackPlugin 使用 contenthash 而不是 chunkhash
因为提取出来的内容是代码内容本身，而不是一组模块组成的 chunk

### chunkFilename

配置无入口的 chunk 如 commonchunk， 动态加载`import('path/to/module)`chunk 的名称

### path

配置输出文件的目录，必须是绝对路径

```
path: path.resolve(__dirname, 'dist_[hash]')
```

### publicPath

部分构建出的资源需要异步加载，加载该资源需要对应的 URL 地址

output.publicPath 配置发布到线上资源的 URL 前缀
默认值是空字符串，即使用线上根目录的相对路径

例如线上资源全都在不同站点的 cdn 上

则配置

```
publicPath: 'https://cdn.example.com/assets/'
```

这时 HTML 中加载的标签自动包括该前缀
但是要小心资源找不到线上会产生 404 错误

注意 path 和 publicPath 都只支持 hash 为内置变量？

### crossOriginLoading

webpack 的异步 chunk 是通过 JSONP 加载的
即向 HTML 中插入一个 script 标签去加载异步资源
注意这并不涉及到 JSONP 的远程函数调用，仅用于获取资源也可称为 JSONP

crossOriginLoading 用于配置这个标签的 crossorigin 值

- anonymous（默认），加载此脚本资源时不携带用户 cookie
- use-credentials 携带

### libraryTarget library

构建可以被其他模块导入使用的库时

- libraryTarget 配置导出库的方式

#### var

通过 var 把库设为对应的变量再导出，其中变量为一个有返回值的自执行函数

#### commonjs

输出方式

```js
exports[libraryName] = code;
```

调用方式

```js
require(模块被发布到npm代码仓库的名称)[libraryName];
```

- library 配置导出库的名称

#### commonjs2

```js
module.exports = code;
```

#### this

```js
this[libraryName] = code;
```

#### window

同理

#### global

同理

### libraryExport

> 仅适用于 cjs 导出方式
> 限制导出模块

```js
export const a = 1;
export default b = 2;
```

如果设置为 a，最终 webpack 生成的 js 代码只会导出 a

```js
module.exports = lib_code["a"];
```

## module

### rules

一个数组，其中每一项负责配置一个 loader

- loader 配置中主要通过 test include exclude 三个配置来选中 loader 要应用的文件

- 通过 use 配置项选择具体的 loader，可以只应用一个 loader 也可以按从后往前的顺序应用一组 loader，同时可以分别向 loader 中传入参数

- 一组 Loader 的执行顺序默认是从右往左打，通过 enforce 可以将其中一个 loader 执行顺序放到最前或最后

```js
module: {
  rules: [{
  // 命中 JavaScript 文件
  test: /\.js$／,
  // 用 babel -loader 转换 JavaScript 文件
  // ?cache Directory 表示传给 babel-loader 的参数，用于缓存 babel 的编译结果，
  // 加快重新编译的速度
  use: ['babel-loader?cacheDirectory'],
  // 只命中 src 目录里的 JavaScript 文件，加快 Webpack 的搜索速度
  include: path.resolve(__dirname ,'src')
  },
  {
  test: /\.scss$/ ,
  // 使用一组 Loader 去处理 scss 文件
  // 处理顺序为从后到前，即先交给 sass-loader 处理，再将结果交给 css-loader,最后交给 style-loader
  use: ['style-loader','css-loader','sass-loader'],
  // 排除 node modules 目录下的文件
  exclude: path.resolve(__dirname ,'node_modules'),
  },
  {
  //对非文本文件采用 file-loader 加载
  test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
  use: ['file-loader']
  }
  ]
}
```

在 loader 需要传入很多参数时，我们还可以通过一个 Object 来描述，例如在上面的
babel-loader

```js
use: [
  {
  loader:'babel-loader',
  options:{
      cacheDirectory:true,
  }
  // enforce ：'post'的含义是将该 Loader 的执行顺序放到最后
  // enforce 的值还可以是 pre ，代表将 Loader 的执行顺序放到最前面
  enforce :'post'
  // 省略其他 Loader
  }
]
```

#### noParse(可选)

忽略部分没有模块化的文件的递归解析和处理
能提高构建性能

比如一些库如 jQuery ChartJS 庞大又没有采用模块化标准
让 wp 解析耗时又没有意义

类型可以是 regexp,function

如果是 function，会校验该模块的每个对应文件路径，返回 true 和 false

```js
noParse: (content) => {
  return /jquery/.test(content);
};
```

注意，被忽略的文件应该是使用别的模块化方式，比如挂载全局变量

不应该包含 import,require,define 等模块化语句，否则构建出的代码无法在浏览器环境下执行

#### parser

该对象可以更精确控制，某个 loader 会解析哪些模块语法，不会解析哪些模块语法

```js
parser:{
  commonjs: false, // 禁用commonjs
  harmony: false, // 禁用es6 import export
}
```

### alias

resolve.alias 通过配置别名来将原导入路径映射成一个新的导入路径

```js
resolve: {
  alias: {
    components: "./src/components";
  }
}
```

当通过`import Button from 'components/button'`导入时,实际上被 alias 替换成了
`import Button from './src/components/button`

这样可能会命中太多导入语句
alias 还可以通过$符号，缩小范围到只命中关键字为结尾的导入语句

这样一些特异的引入，如`/path/to/react`
alias 不需要给`/path/to`这个常用目录做命中

而是去命中以 react 结尾的引入

```js
resolve: {
  alias:{
    'react$':'/path/to/react'
  }
}

import 'react' 即为
import '/path/to/react'
```

### mainfields

> 不确定使用场景？

package.json 中针对不同环境配置了不同的代码入口（cjs,esm）
mainfileds 数组配置优先使用哪份代码

```js
// 默认
mainFields: ["browser", "main"];
// webpack会按照数组里的顺序在package.json文件里寻找
// 只会使用找到的第一个文件

{
  "jsnext:main": "es/index.js",
  "main":"lib/index.js"
}

mainFields: ['jsnext:main','browser','main']
```

### modules

resolve.module 配置 webpack 去哪些目录寻找第三方模块

如果大量导入的模块都在`./src/components`目录下
则配置成 `modules: ['./src/components','node_modules']`

则 `import 'button'`会先去 `src/components` 下找

### descriptionFiles

配置 package.json 的名称
`descriptionFiles: ['package.json']`

### enforceExtension

强制所有导入要带上文件后缀名

### enforceModuleExtension

和 enforceExtension 类似，但是只对 node_modules 下文件生效

因为 node_modules 下很多模块中内部引入没有后缀名，为了兼容这些模块，要手动关掉这一配置

## plugin

接受一个数组，数组每一项都是一个 plugin 实例，通过构造函数创建

```js
// 使用提取common chunk 的plugin
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonChunkPlugin");
module.exports = {
  plugins: [
    // 所有页面都会用到的公共代码被提取到common代码块中
    new CommonsChunkPlugin({
      name: "common",
      chunks: ["a", "b"],
    }),
  ],
};
```

## usedExports（treeshaking）

只要确保代码中使用的是 静态 import 即可开启

```js
module.exports = {
  optimization: {
    usedExports: true,
  },
};
```
