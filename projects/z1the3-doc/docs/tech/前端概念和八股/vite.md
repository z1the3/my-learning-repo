# Vite 相关

## esbuild 依赖预构建

什么是依赖预构建 （类似于打包构建，但是没有组合

● 首次启动的时候 Vite 默认情况下，Vite 会抓取你的 index.html 来检测需要预构建的依赖项，将 HTML 文件作为应用入口（也可以通过 optimizeDeps.entries 属性自定义入口）

● 然后根据入口文件扫描出(由 scanImports 函数完成，/packages/vite/src/node/optimizer/scan.ts)项目中用到的第三方依赖

● 最后对这些依赖逐个进行编译，最后将编译后的文件缓存在内存中（node_modules/.vite 文件下），在启动 DevServer 时（启动时而不是打开页面时）直接请求该缓存内容。

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/image (11).png" width="500"/>

● 但是，vite 的扫描并不是百分之百准确的，比如在某些动态 import 的场景下，由于 Vite 天然按需加载的特性，经常会导致某些依赖只能在运行时被识别出来。

在 vite.config.js 文件中配置 optimizeDeps optimizeDeps.include:string[] 或者 optimizeDeps.exclude:string[] 选项可以选择需要或不需要进行预编译的依赖的名称

Vite 则会根据该选项来确定是否对该依赖进行**预编译**。如果依赖项很大（包含很多内部模块）或者是 CommonJS，那么你应该包含它；如果依赖项很小，并且已经是有效的 ESM，则可以排除它，让浏览器直接加载它（不需要放入预构建的缓存里，浏览器启动后才去加载）。（性能优化思路）

● 在启动时添加 --force options，可以用来强制重新(强制重新依赖预构建指的是忽略之前已构建的文件，直接重新编译)进行依赖预构建。

## 依赖预构建的作用

● 兼容 CommonJS 和 AMD 模块的依赖：因为 Vite 的 DevServer 是基于浏览器的 Natvie ES Module 实现的，所以对于使用的依赖如果是 CommonJS 或 AMD 的模块（必须经过构建，转换语法），则需要进行模块类型的转化（ES Module）。

● 减少模块间依赖引用导致过多的请求次数（预构建的内容，不需要在浏览器页面启动后再去请求 esm 模块）：通常我们引入的一些依赖，它自己又会一些其他依赖。

## 官方示例

一些包将它们的 ES 模块构建作为许多单独的文件相互导入。例如，lodash-es 内部有超过 600 多个模块。当我们执行

import { debounce } from 'lodash-es' 时，浏览器同时发出 600 多个 HTTP 请求！尽管服务器在处理这些请

求时没有问题，但大量的请求会在浏览器端造成网络拥塞，导致页面的加载速度相当慢。

lodash-es 模块使用预编译相较于未使用预编译请求加载速度缩短了近 20 倍的时间！

**经过预构建后相当于把含 600 个引用的模块编译为一个文件，同时不会产生复杂的相对路径**

## 依赖预构建的源码实现

所有的预构建产物默认缓存在 node_modules/.vite 目录中。如果以下 3 个地方都没有改动，Vite 将一直使用缓存文件:

● package.json 的 dependencies 字段
● 各种包管理器的 lockfile 文件
● vite --force / 直接删掉 .vite 目录

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/image (12).png" width="500"/>

通过 bind 方法重写 listen 函数

httpserver 是 node 模块上带的创建服务器方法

这里用了去除 listen，**绑定 this**,扩展重写的技巧

在执行 yarn dev 启动 DevServer 之前，vite 会拦截通过重写 listen 函数调用 runOptimize 函数，进行依赖预构建相关的处理

runOptimize 函数负责的是调用和注册处理依赖预构建相关的函数，该函数主要完成两件事。

#### 第一件事：进行依赖预构建 optimizeDeps()

optimizeDeps()主要是根据配置文件生成 hash，获取上次预购建的内容(存放在\_metadata.json 文件)。如果不是强预构建就对比\_metadata.json 文件的 hash 和新生成的 hash：一致就返回\_metadata.json 文件的内容，否则清空缓存文件通过 ScanImport 调用 Esbuild 构建模块再次存入\_metadata.json 文件

optimizeDps 函数：
● 根据 --force 参数判断是否是强预构建
● 如果不是强预构建，则对比对比缓存文件\_\_metadata.json 的 hash。
● 缓存失效或者未缓存则根据 optimizeDps 配置使用 esbuild 编译依赖。

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/image (14).png" width="500"/>

四个属性

● hash 由需要进行预编译的文件内容生成的，用于防止 DevServer 启动时重复编译相同的依赖，即依赖并没有发生变化，不需要重新编译。

● browserHash 由 hash 和在运行时发现的额外的依赖生成的，用于让预编译的依赖的浏览器请求无效。

● optimized 包含每个进行过预编译的依赖，其对应的属性会描述依赖源文件路径 src 和编译后所在路径 file。

● needsInterop 主要用于在 Vite 进行依赖性导入分析，这是由 importAnalysisPlugin 插件中的 transformCjsImport 函数负责的，它会对需要预编译且为 CommonJS 的依赖导入代码进行重写。

#### 第二件事：注册依赖预构建相关函数 createMissingImporterRegisterFn()

调用 createMissingImpoterRegisterFn 函数，它会返回一个函数，其仍然内部会调用 optimizeDeps 函数进行预编译

只是不同于第一次预编译过程，此时会传入一个 newDeps，即新的需要进行预编译的依赖。

在服务器已经启动之后，如果遇到一个新的依赖关系导入，而这个依赖关系还没有在缓存中，Vite 将重新运行依赖构建进程并重新加载页面。

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/image (15).png" width="500"/>

二次预构建

注意这并不属于 HMR, 而是依赖关系（如 package.json 改变）改变触发，重新编译需要进行预编译的依赖
