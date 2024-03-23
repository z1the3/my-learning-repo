# Webpack

## 配置

```json

      entry:{
        main:'./src/js/app.js'
      }
      output: {                     // 输出配置
        filename: './js/built.js',      // 输出文件名
        path: resolve(__dirname, 'build')   //输出文件路径配置
      },
      mode: 'development'   //开发环境(二选一)


 module: {
      rules: [
        {
          test: /\.js$/,  //只检测js文件
          exclude: /node_modules/,  //排除node_modules文件夹
          enforce: "pre",  //提前加载使用
          use: { //使用eslint-loader解析
            loader: "eslint-loader"
          }
        },
        {
        test: /\.less$/, // 检查文件是否以.less结尾（检查是否是less文件）
        use: [  // 数组中loader执行是从下到上，从右到左顺序执行!!!!!!!!!!!
          'style-loader', // 创建style标签，添加上js中的css代码
          'css-loader', // 将css以commonjs方式整合到js文件中
          'less-loader'  // 将less文件解析成css文件
        ]
      },
       {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192, // 8kb --> 8kb以下的图片会base64处理
            outputPath: 'images', // 决定文件本地输出路径
            publicPath: '../build/images',  // 决定图片的url路径
            name: '[hash:8].[ext]' // 修改文件名称 [hash:8] hash值取8位  [ext] 文件扩展名
          }
        }
      },
      {
        test: /\.(eot|svg|woff|woff2|ttf|mp3|mp4|avi)$/,  // 处理其他资源
        loader: 'file-loader',
        options: {
          outputPath: 'media',
          name: '[hash:8].[ext]'
        }
      }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html', // 以当前文件为模板创建新的HtML(1. 结构和原来一样 2. 会自动引入打包的资源)
        minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
    }
      }),
       new OptimizeCssAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
          cssProcessorOptions: { // 解决没有source map问题
            map: {
              inline: false,
              annotation: true,
            }
          }
  })
    ]


```

### 语法转化

```json
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }

```

优点
解决 babel 只能转换部分低级语法的问题(如：let/const/解构赋值…)，引入 polyfill 可以转换高级语法(如:Promise…)
缺点
将所有高级语法都进行了转换，但实际上可能只使用一部分
解决
需要按需加载（使用了什么高级语法，就转换什么，而其他的不转换）
第二种方法：借助按需引入 core-js 按需引入

```json
{
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'usage',  // 按需引入需要使用polyfill
              corejs: { version: 3 }, // 解决warn
              targets: { // 指定兼容性处理哪些浏览器
                "chrome": "58",
                "ie": "9",
              }
            }
          ]
        ],
        cacheDirectory: true, // 开启babel缓存
      }
    }
  },
```

### devServer

```json
    devServer: {
      contentBase: resolve(__dirname, 'build'), // 运行项目的目录
      open: true, // 自动打开浏览器
      compress: true, // 启动gzip压缩
      port: 3000, // 端口号
      hot: true // 开启热模替换功能 HMR
    }
```

## 优化

### 构建加速

通过减少 webpack 的不必要工作

1. 通过合理处理 weback 相关配置，使得不必要的工作尽量少

webpack 使用 enhanced-resolve 包来进行统一的路径解析，即将代码中引用的普通文件，第三方包 以及 loader 文件地址解析成绝对路径，因此可以从这个方面入手来减少 webpack 的工作时长。

```json
loader: 'css-loader'

// 改成

loader: path.resolve(__dirname, './node_modules/css-loader/dist/cjs.js')
```

2. 配置 externals

某些第三方模块，不需要打包，而是直接通过 CDN 方式引用。

通过 externals 可以将不需要打包到 bundle 中的第三方模块声明出来，从而减少重复工作

3. 配置 include 或者 exclude，对于不需要处理的文件进行省略。

4. 抽离共用模块，让重复性的工作尽量少

5. 配置 splitChunks， 合理切分

将多个页面重复使用的依赖文件在打包过程中单独切分出来，不仅减少了 build 的时长，

也减少了整体的打包体积。同时结合线上文件缓存，加速了页面的首屏渲染。

6. 利用 DLL

**将不常变化的第三方模块单独进行编译**，生成 dll.js 和 mainfeat.json 文件。然后在工程的 webpack config 文件中引入相应的 DLL 配置，使得在正常编译中不会去重新去处理 dll.js 所涉及到的库，从而减少了工作量。
● 配置 Dll 工作较为繁琐，对于 jupiter 工程，我们还需额外配置一个 webpack 打包配置，进行提前的 dll 编译工作。
● 在 dll 涉及到的第三方模块发生改变的时候，需要记得去更新。

### 利用缓存

● 某些 loader 可以配置缓存
比如说 babel-loader 可以通过配置 cacheDirectory 来设置缓存
● 在 heavy loader 之后加上 cache-loader
由于生成和读取缓存文件都有一定的性能开销，所以只建议对比较重的 loader 使用 cache-loader。
● hard-source-webpack-plugin
在开发模式中加上 hard-source-webpack-plugin 可以有效的提升 rebuild 的速度
● terser-webpack-plugin 可以在代码压缩阶段配置缓存

并行处理
● 代码压缩时的并行
Webpack 官方内置的 terser-webpack-plugin 可以通过开启多进程来减少代码压缩时间，
● 费时的 loader 并行运行
在 webpack 构建过程中，实际上耗费时间大多数用在 loader 解析转换过程中，而 Happypack 和 Thread-loader 都可以开启多进程来减少 loader 处理文件的时间。
而 happypack 配置繁琐，同时官方也不再维护更新，并且推荐在 webpack4 及以后使用 thread-loader。
● 多次构建时并行运行: parallel-webpack

## 异步加载

import() 语法分为了静态引入以及动态引入。

静态引入无需多说，动态引入也已在 ES6 中得到了实现，import 在支持 ES6 语法的环境中将会是一个全局函数，它接收需要动态引入的脚本地址，返回一个 Promise，其异步返回值将会是一个对象，对象中包含动态引入模块的导出信息。

`为了兼容性，Webpack 将会对 import() 语法作编译处理，将其转换为 WebpackJsonp 的加载方式。Webpack 将引入的模块单独打包为一个 chunk，在需要用到这部分代码时再使用注入 <script> 标签的方式将其请求到本地并运行。 此外，Webpack 还对这个 API 进行了一些能力扩展，比如可以在其中书写 /_ webpackChunkName: "xxx" _/ 这样的注释实现自定义这个模块的 chunk 名称。`

## 按需引入

### 利用 babel

babel-plugin-import 是一个处理模块导入的 Babel 插件。

它对三方库进行按需引入的处理在默认配置下有些约定俗成的意味，它要求三方库中拥有 lib 文件夹，并且在 lib 文件夹中拥有和三方库同名（camel-case）的模块文件。抛开默认情况，它也提供了一系列配置让我们可以自定义三方库的导入形式。这个特性可以实现诸如根据环境选择导入不同的模块、组件库的按需引入、工具函数库的按需引入等一系列需求。

`from antd->from antd/lib/xxx`

### tree-shaking

Tree Shaking 的用途其实就是分析代码，将未导入的并且没有副作用的模块（文件或局部代码）在最终构建结果中删除。

如何剔除无副作用的代码
Webpack 4 天然支持了 Tree Shaking，我们必须执行以下操作确保其生效：

使用 ES2015 模块语法（即 import 和 export）；
确保没有编译器将您的 ES2015 模块语法转换为 CommonJS（顺带一提，这是现在常用的 @babel/preset-env 的默认行为，详细信息请参阅 文档 ）；
