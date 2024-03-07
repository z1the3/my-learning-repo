# Webpack

## 分包

bundle 文件 = 运行时代码（很小一部分，常规 js 逻辑） + 第三方库 js + 页面

## chunk 和 bundle 的区别是什么

1. chunk 是打包过程中 modules 模块的集合，是打包过程中的概念‘
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
     neme:"vendor",
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
**运行时代码和第三方库作为 Chunk_Common**

## 分包的策略

1、Entry 分包（多入口应用）
2、异步模块（动态引用 import('./xxx.js')
3、Runtime 分包 （把运行时代码单独打包）

# 实现一个简单的 webpack

生成 AST
返回对象 File -> prograom ->body->ImportDeclaration->source->value（就是文件的地址）

使用 babylon, 一个基于 babel 的 js 解析工具，生成 AST 语法树
使用 babel-traverse, 可以像遍历对象一样遍历 AST 语法树
使用 babel-core 将代码转化为模块化需要的（含有 export 定义,而且是严格模式）API 是 transformFromAst
使用 babel-preset-env 指定转化规则，

```js
const babylon = require("babylon");
const fs = require("fs");
const path = require("path");
const traverse = require("babel-traverse").default;
const babel = require("babel-core");
```

解析一个模块，生成 ast, 遍历 ast 语法树，把任何引用语句的参数加到依赖里
同时通过 babel 将 AST 树转回处理后的代码，返回一个模块

```js
let ID = 0;
function createAsset(filename) {
  const content = fs.readFileSync(filename, "utf-8");
  const ast = babylon.parse(content, {
    sourceType: "module",
  });
  const dependencies = [];
  // 遍历ast,获取entries的依赖
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });
  const id = ID++;
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["env"],
  });
  return {
    id,
    filename,
    dependencies,
    code,
  };
}
```

根据模块，递归地解析其他的模块，如果 dependencies 中全是相对路径，再解析时顺便生成绝对路径，

然后顺便解析一下那个子模块,并在父模块的上面追加 mapping 属性,是子模块 id 和子模块绝对路径的映射

把子模块加入到队列后面,这样能开始分析子模块依赖的孙子模块的相对路径

```js
// 建立依赖图
function createGraph(entry) {
  const mainAsset = createAsset(entry);
  const allAsset = [mainAsset];

  // 转为绝对路径
  // allAsset中有多个entry
  for (let asset of allAsset) {
    // 当前entry的dir绝对路径 C:/entry.js，用于使用path.join结合
    const dirname = path.dirname(asset.filename);

    // 提供快捷访问依赖的映射
    asset.mapping = {};
    asset.dependencies.forEach((relativePath) => {
      // C:/a/entry.js,  ./dep.js ->  C:/a/dep.js
      const absolutePath = path.join(dirname, relativePath);
      // 带着当前的绝对路径解析子依赖
      const childAsset = createAsset(absolutePath);
      asset.mapping[relativePath] = childAsset.id;
      // 因为allAssrt会push到队列后，所以最终会类似BFS一样完全解析
      allAsset.push(childAsset);
    });
  }
  return allAsset;
}
```

```js
// 根据依赖图打包生成bundle
function bundle(graph) {
  // 是一个string,[fn,mapping],[fn,mapping]这样
  let modules = "";

  // 创建模块，每个模块都是一个自执行函数
  graph.forEach((module) => {
    modules += `
        ${module.id}:[
            function(require,module,exports){
                ${module.code}
            },
            ${JSON.stringify(module.mapping)}
        ]
        `;
  });
  // 实现require方法
  const result = `
        (function(modules)){
            function require(id) {
                // 根据id拿code和idmap
                const [fn,mapping] =  modules[id]

                // 根据相对路径拿id
                function localRequire(relativePath){
                    return require(mapping[rlatvePath])
                }

                // 创建真正的module
                const module = {exports:{}}

                fn(localRequire,module,module.exports)
                return module.exports
            }
            require(0)
        }({${modules}})
    `;
}
```
