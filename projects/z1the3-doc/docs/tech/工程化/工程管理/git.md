# Git

## Git 原理

### .git目录下主要的子目录

- /hooks管理周期钩子
- info/exclude管理ignore
- objects管理实际文件内容（类似数据库）
- - object里存了所有资源，包括blob（文件本身） commit branch
- remote存远端分支
- refs管理分支

### commit

一个commit内容包括tree parent author committer size message

通过tree记录blob的标识

tree下面存有多个文件的blob的hash值

parent串到上一个commit

### checkout

`git checkout -b iss53 master`
在master分支（一个指针）指向的commit记录上，创建一个指向该commit的iss53分支，并把head指向iss53

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

 master和iss53, 仅iss53有新的commit，这时将iss53合入master，只需要将master指针直接指到iss53最新的commit就算合并

#### long fast-forward merge

这时master已经和iss53一致，再将iss53(master)和 i18n合并 git merge i18n

iss53和i18n都有新的commit，但是两个commit没有冲突，生成一个新的commit记录，是两个commit的并集。

有冲突 使用git status 得知 xxx.html unmerge

需要git add , commit解决冲突

#### branch -d

前提： 切换到另一条分支，作为当前分支

-d未merge到当前分支的无法删除

-D可以删除未merge分支

#### push

git push本地到远端

如果是**超集**，才能push成功

否则会在本地通过（fetch） 创建一条origin/master分支，来等待和master分支进行merge操作

#### pull

fetch + merge

#### log

将所有通向当前commit的所有commit记录展示出来（可以多个分支指向同一个）

log --oneline 只展示一条分支上的

--all 把整个仓库的图完全展示出来

`log branchA ^branchB`分支A中所有不在分支B中的commit, 比如说没有根commit

#### rebase

将该分支所有commit线性放置到原先分支最新位置，但是commit号（因为同时基于内容和父节点）和时间都会发生变动

线性的好处（可以通过二分，在一条线上快速定位产生bug的commit）

通过-add参数可以自由把commit合体/调换顺序

---
内部存在压缩算法，保证性能，commit之间有diff存储，但是不是按照顺序存储diff的，底层通过排序自由找到合适的增量存储内容
