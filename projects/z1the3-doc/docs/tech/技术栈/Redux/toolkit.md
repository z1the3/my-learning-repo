# @redux/toolkit API

在上述的实际案例中，用到了如下 API：

- configureStore(): 简化 Store 的创建，默认创建了执行异步的中间件，自动启用 redux devtool
- combineReducers(): 简化合并 reducer 的操作，并自动注入 state 和 action
- createSlice(): 简化并统一创建 action creator、reducer
  上述仨 API 可以满足大部分的场景，在此工具辅助下，极大程度上减少了 TypeScript 类型定义的工作。
  当然，想要了解更多关于 @redux/toolkit 便捷的 API，推荐阅读官方文档：
- @redux/tookit 的 API 使用手册
  https://redux-toolkit.js.org/usage/usage-guide
- @redux/tookit 的 API 使用手册 —— TypeScript 类型相关
  https://redux-toolkit.js.org/usage/usage-with-typescript
