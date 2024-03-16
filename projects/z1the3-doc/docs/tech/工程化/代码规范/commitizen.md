---
sidebar_position: 1
tags: [Commitzen, 前端工程化]
---

# commitizen规范提交

:::note
好的commit message 可以帮助我们了解提交历史从而帮助我们快速分析问题，了解bug产生原因等
:::

`commitizen` 可以用**轮询交互**的方式帮我们生成符合规范的`commit message`

## Angular 规范

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/2433117761.png" width="500"/>

## 使用

### 全局安装

1. 全局下载两个包
`npm install -g commitizen cz-conventional-changelog`

2. 创建 ~/.czrc 文件，写入如下内容
`{ "path": "cz-conventional-changelog" }`

3. 这时就可以全局使用 git cz 命令来**代替** git commit 命令了

### 项目内安装

1. 只要下commitizen, dev依赖
`npm install --save-dev commitizen`

2. 配置，打开项目的 package.json 文件，配置如下

```
 {
  "scripts": {
    "commit": "git-cz",
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-conventional-changelog"
    }
  }
}
```

3. 使用 npm run commit 代替 git commit
