# git

## commit 分支所在 branch 被删除

开启 reflogs，找回丢失的 commit
然后在 commit 上重新 checkout 分支

## 和主分支 merge

先`git checkout master`
再`git merge feat/xxx`

feat/xxx 上会新增一个 commit，这个 commit 中解决了冲突

pull request 就可以直接 merge 往 master
