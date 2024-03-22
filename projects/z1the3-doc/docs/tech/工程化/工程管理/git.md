# Git

## 介绍

分布式管理工具 git
是本地管理工具和集中式管理工具的结合,
既可以支持代码集中管理，多人团队中每一个成员又拥有一个完整仓库
任何一处协同工作用的服务器发生故障，事后都可以用任何一个镜像出来的本地仓库恢复

支持分支，能进行并行开发，可以恢复到任意时间点

fork 表示克隆出一个仓库的新拷贝，包含了原来仓库（upstream repository）的所有分支，tag，历史，issue 和提交
clone 克隆出一个仓库，但是下载到本地
git branch --list 列出该仓库的所有分支
git diff 查看当前代码 add 后，会 add 哪些内容
git status 查看当前分支状态
git pull origin 远程:本地
如果没有:本地则默认和当前分支合并
git commit --amend [file1] [file2]可以重做上一次 commit

```
git log查看提交历史
git reset --hard HEAD撤销工作目录中所有未提交文件的修改历史
git checkout HEAD <file>撤销指定未提交文件的修改内容
git revert <commit ID>撤销指定提交
```

## 概念

HEAD 指针就是你所在的位置，指向分支指针
分支指针则指向当前分支最新的一次 commit 提交

工作树的代码通过 git add 添加到 git 索引中
commit 则是将索引中的文件提交到 git 仓库中

git fetch 是将远程主机的最新内容拉到本地，用户在检查了以后决定是否合并到工作本机分支中
而 git pull 则是将远程主机的最新内容拉下来后直接合并，即：git pull = git fetch + git merge，这样可能会产生冲突，需要手动解决

git stash 会同时缓存 staged changes 和 unstaged changes
相当于一个栈
● git stash
● git pull
● git stash pop

● git stash：保存开发到一半的代码
● git commit -m '修改问题'
● git stash pop：将代码追加到最新的提交之后

## git rebase 和 git merge 的区别

git merge 和 git rebase 都是用于分支合并，关键在 commit 记录的处理上不同：

- git merge 会新建一个新的 commit 对象，然后两个分支以前的 commit 记录都指向这个新 commit 记录。这种方法会保留之前每个分支的 commit 历史。
  （创建一条新的，然后两个末端指向新的前端）
- git rebase 会先找到两个分支的第一个共同的 commit 祖先记录，然后将提取当前分支这之后的所有 commit 记录，然后将这个 commit 记录添加到目标分支的**最新提交**后面。经过这个合并后，两个分支合并后的 commit 记录就变为了线性的记录了。
  （直接把自己的接在目标的后面，但是会截取掉自己和目标从前端算起共同的部分，从而防止重复

merge 会新增一个 commit 提交，会导致历史记录更复杂
rebase 不会，直接分支移动，消除

## git reset 和 git revert 的区别

git reset 用于回退版本，可以遗弃提交，
指定参数可以影响遗弃的范围，可以指定是否复原索引或工作树
● --mixed（默认）：默认的时候，只有暂存区变化
● --hard 参数：如果使用 --hard 参数，那么工作区也会变化
● --soft：如果使用 --soft 参数，那么暂存区和工作区都不会变化

git revert 不会遗弃提交，而是新增一次提交抵消上次提交的变化

reset 指针会往后移动，revert 指针会一直前进

## Git 原理

git 任何文件都会通过 SHA-1 散列哈希计算一个 40 位的校验和进行标识

### .git 目录下主要的子目录

- /hooks 管理周期钩子
- info/exclude 管理 ignore
- objects 管理实际文件内容（类似数据库）
- - object 里存了所有资源，包括 blob（文件本身） commit branch
- remote 存远端分支
- refs 管理分支

### commit

一个 commit 内容包括 tree parent author committer size message

通过 tree 记录 blob 的标识

tree 下面存有多个文件的 blob 的 hash 值

parent 串到上一个 commit

### checkout

`git checkout -b iss53 master`
在 master 分支（一个指针）指向的 commit 记录上，创建一个指向该 commit 的 iss53 分支，并把 head 指向 iss53

等同于
`git checkout master`
`git checkout -b iss53`

等同于
`git checkout master`
`git branch iss53`
`git checkout iss53`

### merge

有两种情况

#### fast-forward merge

master 和 iss53, 仅 iss53 有新的 commit，这时将 iss53 合入 master，只需要将 master 指针直接指到 iss53 最新的 commit 就算合并

#### long fast-forward merge

这时 master 已经和 iss53 一致，再将 iss53(master)和 i18n 合并 git merge i18n

iss53 和 i18n 都有新的 commit，但是两个 commit 没有冲突，生成一个新的 commit 记录，是两个 commit 的并集。

有冲突 使用 git status 得知 xxx.html unmerge

需要 git add , commit 解决冲突

#### branch -d

前提： 切换到另一条分支，作为当前分支

-d 未 merge 到当前分支的无法删除

-D 可以删除未 merge 分支

#### push

git push 本地到远端

如果是**超集**，才能 push 成功

否则会在本地通过（fetch） 创建一条 origin/master 分支，来等待和 master 分支进行 merge 操作

#### pull

fetch + merge

#### log

将所有通向当前 commit 的所有 commit 记录展示出来（可以多个分支指向同一个）

log --oneline 只展示一条分支上的

--all 把整个仓库的图完全展示出来

`log branchA ^branchB`分支 A 中所有不在分支 B 中的 commit, 比如说没有根 commit

#### rebase

将该分支所有 commit 线性放置到原先分支最新位置，但是 commit 号（因为同时基于内容和父节点）和时间都会发生变动

线性的好处（可以通过二分，在一条线上快速定位产生 bug 的 commit）

通过-add 参数可以自由把 commit 合体/调换顺序

---

内部存在压缩算法，保证性能，commit 之间有 diff 存储，但是不是按照顺序存储 diff 的，底层通过排序自由找到合适的增量存储内容

## 常用命令速查

```
git clone [url] // 将存储库克隆到本地
git init // 创建新的 Git 仓库，在当前路径下生成 .git 目录

git remote -v // 查看连接的远程仓库地址
git remote add origin [gitUrl] // 为本地仓库添加远程仓库地址
git push -u origin master // 将本地仓库的master和远程仓库的master进行关联
git remote origin set-url [gitUrl] // 为本地仓库修改远程仓库地址
git remote rm origin // 为本地仓库删除远程仓库连接

git checkout [branchName] // 切换分支
git checkout -b [branchName] // 新建分支并切换到该分支

git branch //查看本地分支
git branch -r //查看远程分支
git branch -a //查看本地和远程分支
git branch [branchName] //新建本地分支但不切换
git branch -D [branchName] //删除本地分支

// -m 重命名！！！
git branch -m [oldBranchName] [newBranchName] //重新命名分

git tag [tagName] // 新建标签
git tag // 查看标签列表
git tag -d [tagName] // 删除标签
git push origin [tagName] // 推送标签到远程仓库

git add [file1] [file2] // 添加指定文件至暂存区
git add [dir] // 添加指定目录至暂存区
git add . // 添加当前目录下所有文件至暂存区
git add -A // 添加当前仓库下的所有文件改动至暂存区

git commit -m 'xxx' // 将暂存区文件添加到本地仓库，并记录下备注
git commit -m 'xxx' -n // 将暂存区文件添加到本地仓库，并记录下备注，同时跳过 husky hooks 设置的规则校验
git commit -am 'xxx' // 将文件添加到暂存区，再添加到本地仓库，并记录下备注

git push [remoteName] [branchName] // 推送分支
git push --set-upstream [remoteName] [branchName] // 推送分支并建立关联关系

git pull // 从远程仓库拉取代码合并到本地，等同于 git fetch && git merge
git pull --rebase // 使用rebase的模式进行合并

git fetch // 从所有远程仓库拉取当前分支代码
git fetch [remoteName] // 从指定远程仓库拉取当前分支代码
git fetch --all // 获取所有远程仓库所有分支的更新

git cherry-pick [commitId] // 获取指定的commit

git merge [branchName]

git rebase master // 将当前分支变基到 master 分支上

git reset HEAD^ // 回退所有内容到上一个版本
git reset HEAD^ [filename] // 回退某文件到上一个版本
git reset [commitId] // 回退所有内容到指定版本

git reset --soft HEAD~1 // 回退本地仓库到上一个版本
git reset --hard HEAD~1 // 回退本地仓库到上一个版本，并删除工作区所有未提交的修改内容

git stash // 暂存文件
git stash save 'aa' // 暂存文件，添加备注
git stash pop // 应用最近一次暂存文件，并删除暂存记录
git stash apply // 应用最近一次暂存，但不删除该暂存记录
git stash apply stash@{第几次暂存的代码，例如0} // 应用某一次暂存，但不删除该暂存记录；
git stash list // 暂存记录
git stash clear // 删除所有暂存记录

git reflog

git rm [filname]
git rm [dir]

git log // 查看所有 commit 记录
git  log  --grep  瀑布流 // 搜索 commit msg 有瀑布流关键字的 记录
```
