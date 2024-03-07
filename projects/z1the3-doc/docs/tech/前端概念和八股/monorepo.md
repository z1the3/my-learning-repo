# Monorepo

## 什么是 Monorepo

Monorepo 是一种代码管理模式，对于一个复杂项目，整个项目仓库可以拆分为多个互相依赖的子包。

与 Monorepo 相对的是 Multirepo（或 Polyrepo），也就是我们常见的每个模块建一个 仓库。

> 最开始的思路是 mutirepo 每一个模块都建立一个代码管理进行管理，每一个包都有其独立的版本号/配置/发布流程

> 由于可能有多重子包依赖，最常见的是**文档依赖组件，组件依赖共用工具**

> 那么更新共用工具时，传统 mutirepo 需要**先发布工具库，再发布组件库，最后发布文档库**

> 一旦出错就得废弃版本号

> 另外多个项目的项目配置，构建流程和发布流程也会有可共用的部分，整体性修改 CI 流程的需求需要分别修改多个 repo 再验证正确性

---

monorepo 应用场景

Google、Facebook、微软等公司已经使用了很多年，Vue3、Yarn2 等知名项目现在也改用了 Monorepo。

Vue, CKEditor, UnoCss

element-plus, tinyVue, varlet

常规 web 应用（比如划分出 api 层，各业务模块，公共模块）

### 解决以下问题

- 更便捷的代码复用：项目需要长期迭代和维护，不同模块能作为现成的轮子用于开发后续周边产品，不断积累工程能力
  有利于复用
- 开发流程统一，几个项目共用基础设施，不用重复配置
- 高效管理多个项目/包，有依赖的项目之间调试非常方便，上层应用能够感知其依赖的变化，可以很方便的对依赖项进行修改和调试。
- 常用的包管理工具像 yarn、npm 都会做依赖提升，使用 monorepo 能减少依赖安装时间，同时也减少空间占用。

### 各类 dependencies 比较

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/1280X1280.png" width="500"/>

用 devDependencies 表示的依赖，如果本项目被发包后作为依赖引入，包中的 devDependencies 则不会被用户安装，如构建工具,typescript,vue,代码规范

如果不涉及发包（普通 web 项目），dep 和 devDep 则没有区别，项目中的 devDep 不可能作为依赖中的依赖，dep 和 devDep 都会被正常安装，不过建议还是符合语义

peerDependencies 只是用来定义，真正需要的都放在 dependencies 中被安装，在于生成警告信息
如果只放入 dependencies 可能会造成用户使用的依赖和项目依赖使用的依赖版本不同的问题

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

根目录并不是任何一个模块，而是作为整个组件库 monorepo 项目的管理中枢
在根目录的 package.json 中设置 private: true，使其不会被发布为 npm 包

### package.json

.package.json
包名： @vue/runtime-core
@vue 是包的坐标，相同坐标的包会被安装到同一子目录下

```js
-node_modules
     -@vue
        -runtime-core
        -reactivity
```

### 关于 package.json 版本号

- 主版本号 major.次版本号 minor.修订号 patch
- ^1.x.x 最高仅会更新到 1.y.y（minor 版本），～ 1.2.x 最高仅会更新到 1.2.y（patch 版本）
  - 锁死主版本号和锁死次版本号
- 手动去掉^和～可以写死版本号
- x.y.z：一般来说，z 表示小的 bugfix，y 表示大版本更改（API 的变化）x 表示设计的变动和模块的重构

在实际发布 npm 包时，workspace:^ 会被替换成内部模块 b 的对应版本号(对应 package.json 中的 version 字段)。替换规律如下所示

```json
{
  "dependencies": {
    "a": "workspace:*", // 固定版本依赖，被转换成 x.x.x
    "b": "workspace:~", // minor 版本依赖，将被转换成 ~x.x.x
    "c": "workspace:^" // major 版本依赖，将被转换成 ^x.x.x
  }
}
```
