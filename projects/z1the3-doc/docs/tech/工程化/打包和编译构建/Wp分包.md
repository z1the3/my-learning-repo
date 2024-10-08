# Webpack 分包

拓展

https://juejin.cn/post/7142797454490992653

## 分包最大的好处就是利用浏览器缓存

通过打包工具实现前端项目整体模块化的优势固然很明显，但是它同样存在一些弊端，那就是我们项目中的所有代码最终都被打包到了一起，如果我们应用非常复杂，模块非常多的话，我们的打包结果就会特别的大，进而导致我们的系统性能也会变差，首屏加载时间变长。

## 其次好处

将代码分离到不同的 bundle 中，之后我们可以按需加载，或者并行加载这些文件

默认情况下，所有的 JavaScript 代码（业务代码、第三方依赖、暂时没有用到的模块）在首页全部都加载，就会影响首屏 的加载速度；

代码分离可以分出更小的 bundle，以及控制资源加载优先级，提供代码的加载性能

## 分析

我们可以使用 webpack-bundle-analyzer 插件来进行打包分析，根据包产物结构图进行分解：

webpack 分包在 optimization 字段中配置

## 分包（split chunk）的策略

- 手动分包：将体积很小、改动很频繁的业务模块和体积很大、很少改动的第三方库分开打包，这样修改业务模块的代码不会导致第三方库的缓存失效。
- 自动分包：配置好分包策略后 webpack 每次都会自动完成分包的流程，webpack4 中支持了零配置的特性，同时对块打包也做了优化，CommonsChunkPlugin 已经被移除了，现在使用 optimization.splitChunks 作为 CommonsChunkPlugin 的代替

1、Entry 分包（手动设置多个入口）

2、异步模块（动态引用 `import('./xxx.js')`）

3、Runtime 分包 （把运行时代码单独打包）

以上`import()`是最常见的产生 chunk 的情况

## 分包

bundle 文件 = 运行时代码（很小一部分，常规 js 逻辑） + 第三方库 js + 页面（框架？）

## chunk 和 bundle 的区别是什么

1. chunk 是打包过程中 modules 模块的集合，是打包过程中的概念
   一个入口模块，通过引用关系找到别的 module, 这些 module 就形成了一个 chunk
   如果有多个入口模块，可能会产生多条引用关系路径，每条路径都会形成一个 chunk

   ```json
   entry:{
    chunk1:[a.js,b.js]
   }
   // 只有一个chunk


    entry:{
      chunk1:a.js,
      chunk2:b.js
    }
    尽管依赖关系重合也会生成两个 chunk
   ```

```

```

2. bundle 是我们最终输出的一个或多个打包好的文件
3. chunk 和 bundle 的关系
   大多数情况下一个 chunk 会产生一个 bundle, 但是也有例外
   比如

加上
devtool:"source-map"
只会生成一个 chunk，但是两个 bundle, 一个是 index.js，一个是 index.js.map
所以如果加了 source map,一个 entry 就会对应一个 chunk 和两个 bundle
`npm i webpack webpack-cli`

```js title="webpack.config.js"
module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "[name].js",
  },
};
```

## Split Chunk

将多个页面重复使用的依赖文件在打包过程中单独切分出来，不仅减少了 build 的时长，

也减少了整体的打包体积。同时结合线上文件缓存，加速了页面的首屏渲染。

```json
entry:{
 index:'./src/index.js',
 other:'./src/multiply.js'
}
optimization:{
 runtimeChunk:"single",
  splitChunks:{
   cacheGroups:{
    commons:{
     chunks:"initial",
     minChunks:2, //如果被至少两个chunks用到，
      // 才会生成一个common chunks
     minSize:0 //体积最小要多少
    },
     // 指示要分包的内容是node_modules下的内容
    vendor:{
     test: /node_modules/,
     chunks: "initial",
     name:"vendor",
     enforce: true
    }
   }
  }
}


```

会产生几个 chunk? 5 个

1. entry index
2. entry other
3. runtimeChunk (runtimeChunk "single"浏览器运行时负责引入模块导出模块的代码
   把它单独拆分到 runtimeChunk 中)
4. splitChunk commons (共用代码)
5. splitChunk vendor (来自 nodemodules)

## 不分包造成的问题

1. 把所有代码都放在一个文件（bundle）里输出，体积过大，影响首屏加载速度
2. 缓存效率低，因为浏览器是以文件为缓存单位的，这直接缓存了整个大的 bundle 文件
   如果我们只改变其中一个页面，整个缓存都会失效

分包：把 bundle 文件分成多个 chunk
**运行时代码和第三方库作为 Chunk_Common， 不容易变动**

## 分包实践

### 多入口优化

配置完多入口后

最好使用 Entry Dependencies 或者 SplitChunksPlugin 进行多入口优化

假如我们的 index.js 和 main.js 都依赖两个库：axios
如果我们单纯的进行入口分离，那么打包后的两个 bunlde 都有会有一份 axios
事实上我们可以对他们进行共享；

```js
entry:{
  main1:{
    import:'./src/main1.js',
    dependOn: 'shared' //优化共享依赖
  },
  main2:{
    import:'./src/main2.js',
    dependOn: 'shared' //优化共享依赖
  },
  shared: ['axios']
}

```

### 动态导入

比如我们有一个模块 bar.js：

该模块我们希望在代码运行过程中来加载它（比如判断一个条件成立时加载）；
因为我们并不确定这个模块中的代码一定会用到，所以最好拆分成一个独立的 js 文件；
这样可以保证不用到该内容时，浏览器不需要加载和处理该文件的 js 代码；
这个时候我们就可以使用动态导入；

在 webpack 中，通过动态导入获取到一个对象；
真正导出的内容，在该对象的 default 属性中，所以我们需要做一个简单的解构；

```js
//直接在路由里写也行，会更方便
btn.onclick = function () {
  import(/* webpackChunkName: "about" */ "./router/about").then((res) => {
    res.about();
    res.default();
  });
};
```

## SplitChunks

略

## 参考

- https://zhuanlan.zhihu.com/p/555785707
- https://juejin.cn/post/7195098658583838777
- https://juejin.cn/post/6966879142218301448
- https://zhuanlan.zhihu.com/p/349406330
- https://juejin.cn/post/7054752322269741064
- https://juejin.cn/post/7064853960636989454
