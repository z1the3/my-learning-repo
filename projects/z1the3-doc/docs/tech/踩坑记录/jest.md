## No tests found

When the projects configuration is provided with an array of paths or glob patterns, Jest will run tests in all of the specified projects at the same time. This is great for **monorepos** or when working on multiple projects at the same time

https://jestjs.io/docs/configuration#testmatch-arraystring

设置`testMatch`目录

```ts
const config: Config = {
  verbose: true,
  transform:{},
  projects:[
    {
      displayName:'jest-learning1',
      testMatch:[
        // 不能用相对路径
        '<rootDir>/learning-demo/jest-learning/dist/__tests__/**'
      ]
  }
  ]
};

```

##  SyntaxError: Cannot use import statement outside a module

jest仅仅实验性支持ESM，不支持直接调用jest命令

需要打开node实验性质的esm flag，再node执行node_modules下的jest入口文件

或者通过transform配置babel做规范转化


```json
  "type": "module",
  "scripts": {
    "test": "tsc && cd ../../ && node --experimental-vm-modules ./node_modules/jest/bin/jest.js"
  },
```
其他步骤见

https://jestjs.io/docs/ecmascript-modules


可能需要指定为mjs

### 第三方模块报错

https://juejin.cn/post/7032623660896796709?from=search-suggest

映射到cjs或者mock

或者使用vitest

## 支持typescript

https://jestjs.io/docs/getting-started#using-typescript

可以用babel转换（不支持类型检查），或者tsc编译后再做测试


## 支持jsx

```
  "devDependencies": {
    "@types/jest": "^22.0.0",
    "babel-core": "^6.26.0",
    "babel-jest": "^22.0.4",
    "babel-preset-env": "^1.6.1",
    "jest": "^22.0.4",
    "typescript": "^2.6.2"
  },
  "jest": {
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    }
  }

```

```
//.babelrc

{
    "presets": [
      ["env", {
        "targets": {
          "node": "6"
        }
      }]
    ]
  }
```