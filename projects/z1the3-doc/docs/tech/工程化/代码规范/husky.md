# husky

## 利用对 git hooks 的监听

而 git hooks 本身在`.git/hooks`下

但是在.git/hooks 下做 pre-commit，shell 脚本会被忽略，不受版本控制

不过.git/hooks 是默认目录，可以放在更外层实现同步

相当于手动实现 husky

##

为了避免把不规范的代码提交到远程仓库，一般会在 git 提交代码时对代码语法进行检测，只有检测通过时才能被提交，git 提供了一系列的 githooks，而我们需要其中的 pre-commit 钩子，它会在 git commit 把代码提交到本地仓库之前执行，可以在这个阶段检测代码，如果检测不通过就退出命令行进程停止 commit。

而 husky 就是可以监听 githooks 的工具，可以借助它来完成这件事情。

```
pnpm add husky -D
```

为什么不直接在提交时执行脚本，而是采用 husky？

采用 husky 只是在提交前进行检测，而不是修复操作

如果检测到未修复的地方，会**终止提交**

直接在提交时执行脚本，提交上去的还是未修复的代码

### pre-commit 钩子

新版的 husky 使用有些变化，不再是直接在 package.json 中进行配置。

```
npx husky install
```

在.husky 目录下新增 pre-commit 文件

(注意不是.husky/\_目录)

```
. "$(dirname "$0")/_/husky.sh"

npx --no-install lint-staged
```

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
