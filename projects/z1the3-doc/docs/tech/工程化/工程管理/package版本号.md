# package 版本号

## 单数版本号和双数版本号

双数一般是稳定版
如 node14 16
react 16 18

## lts

长期支持版本

## 关于 package.json 版本号

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
