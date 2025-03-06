# npm

## npm i -g

安装到全局，如 webpack
但是推荐安装到本项目，作为项目依赖，防止不同项目因依赖不同版本的 webpack 导致冲突

安装到本项目后，可执行文件被放在 node_modules/.bin/webpack 中

## 如何确定包管理工具的种类和版本

1. 通过 lock 文件
   pnpm-lock
   yarn.lock
   package-lock.json

2. 通过 package.json
   看一下有没有 engine 参数

3. nodejs Corepack 工具

实验性

看一下开源工具方案比较好

## npm link

适用场景： 本地调试 npm 模块，将模块链接到对应的业务项目中运行

使用方法：假如我们需要把模块 pkg-a 链接到主项目 App 中，首先在 pkg-a 根目录中执行 npm link，然后在 App 根目录中执行 npm link pkg-a 即可。调试完可以使用 npm unlink 取消关联。

原理：npm link 通过软连接将 pkg-a 链接到 node 模块的全局目录和可执行文件中，实现 npm 包命令的全局可执行。

## npx

适用场景：在 npm 5.2.0 版本之后，npm 内置了 npx 的包。npx 是一个简单的 cli 工具，可以帮助我们快速的调试，还可以让我们在不通过 npm 安装包的前提下执行一些 npm 包。
使用方法：
Before: 一般情况下，如果我们想使用 es-lint, 会先通过 npm install es-lint, 然后在项目根目录执行
./node_modules/.bin/es-lint your_file.js 或者 通过 package.json 的 npm scripts 调用 eslint。
After: npx es-lint your_file.js
原理：npx 在运行时会自动去 ./node_moudles/.bin 和 环境变量中 寻找命令
**不会安装**

## npm i -D

npm i -D 是 npm install --save-dev 的简写

--save 表示保存到 package.json 中
-dev 表示安装到 devDependencies 中

```
package  最新的稳定版
package@<version> 安装指定版本
package@beta 安装最新的体验版本
```
