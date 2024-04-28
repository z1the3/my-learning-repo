# eslint

## 继承概念

属性值可以是：

指定配置的字符串(配置文件的路径、可共享配置的名称、eslint:recommended 或 eslint:all)
字符串数组：每个配置继承它前面的配置

怎么理解:
它可以是一个 eslint 配置文件的路径，也可以是我们下载的 npm 包或者插件的名称，亦或者是 eslint 推荐的一些风格例如 eslint:recommended 或 eslint:all。
当它是数组的时候，相当于是这些配置文件的集合，只不过后面相同名称的配置会覆盖之前的配置

值为 eslint:recommended 的 extends 属性启用一系列核心规则，这些规则报告一些常见问题 这个推荐的子集只能在 ESLint 主要版本进行更新。

值为 eslint:all，启用当前安装的 ESLint 中所有的核心规则。这些规则可以在 ESLint 的任何版本进行更改。不推荐使用

> 引用
> https://juejin.cn/post/6922088897979940871

## 使用注释禁用 ESLint

```js
const a = 1; // eslint-disable-line

// 禁用单条规则
const res = eval("42"); // eslint-disable-line no-eval

// 禁用功能块

function usesEval() {
  /* eslint-disable no-eval */
  const res = eval("42");
  const res2 = eval("test");

  return res2 + res;
}


还可以通过将 /* eslint-disable */ 置于文件顶部来禁用所有 ESLint 规则。

```

## 全局禁用规则

可以在 .eslintrc.js 文件单独配置全局禁用规则。

也可以在 package.json 的 eslintConfig 字段配置禁用规则

```js
{
  "rules": {
    "no-eval": 0
  }
}


{
  "eslintConfig": {
    "rules": {
      "no-eval": 0
    }
  }
}

```

文件层面禁用规则，使用 ignorePatterns

或者使用 .eslintignore

```js
{
  "ignorePatterns": ["temp.js", "**/vendor/*.js"],
  "rules": {
    // ...
  }
}
```
