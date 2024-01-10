# Bundle Dependencies

## 介绍

或者叫`BundledDependencies`

是`package.json`当中又一个`xxxDependencies`配置

```
{
  "name": "awesome-web-framework",
  "version": "1.0.0",
  "bundleDependencies": ["renderized", "super-streams"]
  "dependencies":{
    "renderized": "0.0.1",
    "super-streams": "0.0.2"
  }
}
```

定义了发布包时将捆绑的包名称数组

只包含名称，版本仍然会指定在`dependencies`中

效果：即使上游依赖不存在/更改了，被bundleDependencies指定的依赖

仍然不会因为更新上游依赖而消失，相当于永久留档


## 优点

* 您不必创建（和维护）自己的 npm 存储库，但可以获得与 npm 包相同的好处。

* 确保上游依赖发生变化也能提供正确的依赖项

## 缺点

* 依赖发现漏洞，修补效率低；上游修复完后，捆绑该依赖的包也要更新

* 占用内存，不能公用一个副本

## 待补充

非npm第三方包该怎么处理？

https://stackoverflow.com/questions/11207638/advantages-of-bundleddependencies-over-normal-dependencies-in-npm