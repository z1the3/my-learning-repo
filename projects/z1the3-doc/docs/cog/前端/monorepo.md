# Monorepo

## 什么是Monorepo

Monorepo是一种代码管理模式，指在一个项目仓库 (repo) 中管理多个模块/包 (package)。与 Monorepo 相对的是 Multirepo（或Polyrepo），也就是我们常见的每个模块建一个 仓库。 Google、Facebook、微软等公司已经使用了很多年，Vue3、Yarn2 等知名项目现在也改用了 Monorepo。

简单来说就是将多个项目或包文件放到一个git仓库管理

### 解决以下问题：
* 更便捷的代码复用
* 开发流程统一，几个项目共用基础设施，不用重复配置
* 高效管理多个项目/包，有依赖的项目之间调试非常方便，上层应用能够感知其依赖的变化，可以很方便的对依赖项进行修改和调试。
* 常用的包管理工具像 yarn、npm 都会做依赖提升，使用 monorepo 能减少依赖安装时间，同时也减少空间占用。

### Workspaces

Monorepo 中的子项目称为一个 workspace，多个 workspace 构成 workspaces。

使用 workspaces(以 yarn 为例)好处: 
- 依赖包可以被 linked 到一起，这意味着你的工作区可以相互依赖，代码是实时更新的。这是比 `yarn link` 更好的方式因为这只会影响工作区部分，不会影响整个文件系统。

- 所有项目的依赖会被一起安装，这让 Yarn 更方便的优化安装依赖。

- Yarn 只有一个 lock 文件，而不是每个子项目就有一个，这意味着更少的冲突。

#### Pnpm monorepo
  在 monorepo 使用 pnpm 特别简单，直接声明一个 pnpm-workspace.yaml 即可。如果想维持原来的 lock 文件，执行 pnpm import package-lock.json/yarn.lock。

```
// pnpm-workspace.yaml
packages:
  # all packages in direct subdirs of packages/
  - 'packages/*'
```


### 根目录

根目录适合安装开发相关的依赖和小而通用的类库