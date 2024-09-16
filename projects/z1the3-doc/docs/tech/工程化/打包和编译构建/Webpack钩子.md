# Webpack 钩子

## compiler

Compiler 模块是 webpack 的主要引擎，它通过 CLI 或者 Node API 传递的所有选项创建出一个 compilation 实例。

大多数面向用户的插件会首先在 Compiler 上注册。

```js
compiler.hooks.<hook name>
.tap("MyPlugin", (context, entry) => {
  /* ... */
});
```

## complilation

Compilation 模块会被 Compiler 用来创建新的 compilation 对象（或新的 build 对象）。 compilation 实例能够访问所有的模块和它们的依赖（大部分是循环依赖）。 它会对应用程序的依赖图中所有模块， 进行字面上的编译(literal compilation)。 在编译阶段，模块会被加载(load)、封存(seal)、优化(optimize)、 分块(chunk)、哈希(hash)和重新创建(restore)。

```js
compilation.hooks.<hook name>
.tap(
  'SourceMapDevToolModuleOptionsPlugin',
  (module) => {
    module.useSourceMap = true;
  }
);
```

## parser

parser 实例，在 compiler 中被发现，是用来解析由 webpack 处理过的每个模块。parser 也是扩展自 tapable 的 webpack 类 并且提供多种 tapable 钩子，

```js
compiler.hooks.normalModuleFactory.tap("MyPlugin", (factory) => {
  factory.hooks.parser
    .for("javascript/auto")
    .tap("MyPlugin", (parser, options) => {
      parser.hooks.someHook.tap(/* ... */);
    });
});
```
