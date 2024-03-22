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
