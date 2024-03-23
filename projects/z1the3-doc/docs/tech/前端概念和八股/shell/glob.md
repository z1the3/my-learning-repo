# glob

## braces

https://github.com/micromatch/braces

增强 glob 的能力和匹配性能，是 bash 相关的，但是通过 node 实现

### 匹配所有

\*.json

### 匹配特定种

- `a/{b,c}/d`

`a/b/d 和 a/c/d`

- s`a/{a..z}`

## 原理

解析 + linux xargs

xargs 是一个强有力的命令，它能够捕获一个命令的输出，然后传递给另外一个命令。

之所以能用到这个命令，关键是由于很多命令不支持|管道来传递参数，而日常工作中有有这个必要，所以就有了 xargs 命令，例如：
