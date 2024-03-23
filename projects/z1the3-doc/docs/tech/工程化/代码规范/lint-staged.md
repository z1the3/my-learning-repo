# lint-staged

## 原理

git diff --cached
列出当前树的更新

## 使用 lint-staged 优化检测速度

让 eslint 和 prettier 只检测暂存区的文件

```
pnpm add lint-staged -D
```

在 package.json 添加 lint-staged 配置
(适用于 react)

配置是覆盖全部，但是通过 lint-staged 修改只对暂存区文件做处理

两个没有关系

```
"lint-staged": {
  "src/**/*.{ts,tsx}": [
    "pnpm run lint:eslint",
    "pnpm run lint:prettier"
  ]
},

```
