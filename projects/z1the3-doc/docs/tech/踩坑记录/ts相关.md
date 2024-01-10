# ts相关

## Error [ERR_REQUIRE_ESM]: require() of ES Module

Error [ERR_REQUIRE_ESM]: require() of ES Module /Users/teqi/Desktop/Projects/myCDNassets/node_modules/.pnpm/chalk@5.3.0/node_modules/chalk/source/index.js from /Users/teqi/Desktop/Projects/myCDNassets/main.js not supported.

chalk最新版采用ESM规范，但是main.ts被错误地编译成CJS规范的main.js

解决办法：

```json title="tsconfig.json"

    "compilerOptions": {
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
    },

```

node16/nodenext: TS 4.7 提出，为了更好的兼容 es module 和 commonjs 模块化，输入的模块取决于文件名(.cjs, .mjs/.cts, .mts) 或 package.json 中的type字段是("commonjs"、"module")

更改 module 通常需要更改 moduleResolution 配合，moduleResolution 是指ts文件中导入和导出的解析策略

**当我们使用node16或者nodenext时，文件引入必须强制写后缀**

https://nodejs.org/docs/latest-v16.x/api/esm.html#enabling

其他可选配置

* node10(alias node): commonjs

* bundler：ts5新特性，结合第三方构建工具使用。 
https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#moduleresolution-bundler

https://github.com/microsoft/TypeScript/pull/51669

```json title="package.json"

{
    "main": "main.js",
    "type": "module",
    "scripts": {
        "start": "tsc && node ./dist/main.js"
    },
}

```

:::caution
注意这里如果用tsc main.ts会读不到tsconfig的配置，导致还是使用了错误的规范
:::

实在不行也可以考虑将包降级处理


## 在 esm 中使用commonjs

https://nodejs.org/docs/latest-v16.x/api/esm.html#interoperability-with-commonjs

import statements
An import statement can reference an ES module or a CommonJS module. import statements are permitted only in ES modules, but dynamic import() expressions are supported in CommonJS for loading ES modules.

可以在cjs中动态引入esm模块，使用import()

在esm直接import cjs模块即可

When importing CommonJS modules, the module.exports object is provided as the default export. Named exports may be available, provided by static analysis as a convenience for better ecosystem compatibility.

require
The CommonJS module require always treats the files it references as CommonJS.

Using require to load an ES module is not supported because ES modules have asynchronous execution. Instead, use import() to load an ES module from a CommonJS module.

## 如何使用 tsc 打包出 esm 和 cjs 两种包？
在不考虑上述问题(依赖库只支持es)的情况下，如何使用 tsc 打出esm 和 cjs 两种类型的包。

step 1
刚刚也提到，ts编译成什么模块是通过 tsconfig 中的 module 字段控制的。所以需要有两个tsconfig.json文件
非常简单，配置两份tsconfig文件，在编译时 执行
tsc -p tsconfig.json && tsc -p tsconfig.cjs.json

可以看到 dist 目录下生成了 cjs 和 esm 两个目录，但是注意 cjs/index.mjs cjs模块下，还带有mjs后缀！这是因为 tsc 编译的时候不会改变“开发者实际开发的内容” ，也就是说，即使你用 commonjs 模块的方式打包得到的也是.mjs后缀。

how to fix it ？

写一个脚本，去修改cjs的文件后缀以及文本内容中的含.mjs的内容。当然，如果你也输出了 .d.mts 也需要修改对应的后缀

上述方法是我们使用 .mts 的方式去使用es module。如果我们使用"type": "module"，在定义文件和导入的时候使用的是 .ts/.js 后缀，那我们编译之后是不是就不需要修改了？

打包出来的结果确实是不含mjs后缀的，但是因为package.json中指定了"type": "module"导致在解析的时候，默认认为 .js 后缀是使用 es module 的方式运行。你同样需要将 .js 修改成 .cjs 才能正常运行。



打包成两种格式就是为了让自己的库有更好的兼容性，使用者可以根据情况来选择使用 esm 还是 cjs。那么如何配置发包配置呢？
在 package.json 文件中，"exports"、"module" 和 "main" 字段有着不同的作用。

"exports" 字段是在 Node.js 版本 12 及以上引入的，它用于指定模块的导出方式。导入模块时应该使用 cjs 还是 esm 取决于使用时的导入语法。
"module" 字段是在 Node.js 版本 8 及以上引入的，它用于指定 ES 模块的入口文件路径。在使用支持 ES 模块的环境中，例如现代浏览器或 Node.js 版本 13 及以上，这个字段可以用来指定默认的模块入口。
"main" 字段是 Node.js 中常用的字段，它用于指定 CommonJS 模块的入口文件路径。在使用 CommonJS 模块的环境中，例如 Node.js 版本 12 及以下，这个字段可以用来指定默认的模块入口。




```json title="package.json"
{
    "main": "lib/cjs/index.js",
    "module": "lib/esm/index.mjs"
    "typings": "lib/cjs/types/index.d.ts",
    "exports": {
      ".": {
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


作者：七钥
链接：https://juejin.cn/post/7282758586108526592
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。