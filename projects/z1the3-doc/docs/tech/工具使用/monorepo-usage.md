# monorepo实践

基于pnpm workspace

# 1.新建仓库
目录下执行`pnpm init`

# 2.指定项目node版本和pnpm版本

为了减少因node或pnpm版本的差异而产生开发环境错误

在`package.json`中增加`engines`字段来限制版本

```
  "engines": {
    "node": ">=18.0",
    "pnpm": ">=8.0"
  }

```

# 3.防止根目录被当作**包**发布
`package.json`下增加
```
{
  "private": true
}
```

# 4.根目录下加入pnpm-workspace.yaml
```yaml
packages:
# all packages in direct subdirs of projects & learning-demo
  - 'projects/*'
  - 'learning-demo/*'

```

# 5.安装全局依赖包

安装到根目录

常用的编译依赖包：rollup, execa, chalk, enquirer, fs-extra, minimist,
npm-run-all, typescript