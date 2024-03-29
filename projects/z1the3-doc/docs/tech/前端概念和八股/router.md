# 路由

## BrowserRouter

使用干净的 URL 将当前位置存储在浏览器的地址栏中，并使用浏览器的内置历史栈的 api 进行导航。

## HashRouter

HashRouter 用于当 URL 由于某种原因不应（或不能）发送到服务器时, 在 Web 浏览器中使用。在某些您无法完全控制服务器的共享托管场景中，可能会发生这种情况。在这些情况下，HashRouter 可以将当前位置存储在 hash 当前 URL 的部分中，因此永远不会将其发送到服务器。

```note
强烈建议您不要使用HashRouter，除非绝对必要。
```

## MemoryRouter

`MemoryRouter`将其内部位置存储在数组中，它不依赖于外部源，例如浏览器中的历史堆栈。这使得它非常适合需要完全控制历史堆栈的场景，例如测试。

大多数 React Router 的测试都是使用 `MemoryRouter`编写的，
