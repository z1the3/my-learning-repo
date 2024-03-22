# vite 常见配置

## base

开发或生产环境服务的公共基础路径。可以是以下几种值：

绝对 URL 路径，例如 /foo/
完整的 URL，例如 https://foo.com/
空字符串或 ./（用于嵌入形式的开发）

```js
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  base: "/foo/", // 开发或生产环境服务的公共基础路径
});
```

## build

### build.assetsInlineLimit(性能优化可用)

图片转 base64 编码的阈值。为防止过多的 http 请求，Vite 会将小于此阈值的图片转为 base64 格式，可根据实际需求进行调整。
也是为了防止转 base64 过多的性能消耗

类似 webpack 的 url-loader

```js
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    assetsInlineLimit: 4096, // 图片转 base64 编码的阈值
  },
});
```

### build.assetsDir

指定生成静态资源的存放目录。默认值为 assets ，可根据需要进行调整。

```js
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    assetsDir: "static", // 静态资源的存放目录
  },
});
```

### build.outdir

指定打包文件的输出目录。默认值为 dist ，当 dist 被占用或公司有统一命名规范时，可进行调整。

```js
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "build", // 打包文件的输出目录
  },
});
```

## css 预处理器

在 vite 配置文件中向 css 预处理注入全局变量

```js
// vite.config.js
import { defineConfig } from "vite"; // 使用 defineConfig 工具函数获取类型提示：

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`, // 全局变量
      },
    },
  },
});
```

也可以直接引用配置文件

```js
additionalData: `@import '/src/assets/styles/variables.scss';`; // 引入全局变量文件
```

## css 后处理器配置

### 移动端使用 postcss-px-to-viewport 插件

px 单位自动转为 vw 或 vh

```js
// vite.config.js
import { defineConfig } from "vite";
import postcssPxToViewport from "postcss-px-to-viewport";

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        // viewport 布局适配
        postcssPxToViewport({
          viewportWidth: 375,
        }),
      ],
    },
  },
});
```

## optimizeDeps

### optimizeDeps.force

设为 true 后，会强制再次预构建依赖
并重新更新缓存

场景：有时候我们想要修改依赖模块的代码，做一些测试或者打个补丁，这时候就要用到强制依赖预构建。

除了这个方法，我们还可以通过删除 .vite 文件夹或运行 npx vite --force 来强制进行依赖预构建。

## plugins

```js
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig({
  plugins: [vue(), viteMockServe()],
});
```

`@vitejs/plugin-vue` 提供 Vue3 单文件组件的支持，使用 `vite-plugin-mock` 让我们更轻松地 mock 数据

## resolve

### resolve.alias 路径别名

```js
// vite.config.js
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 路径别名
    },
  },
});
```

如果自定义程度不高，可以用插件 ViteAliases 一键配置

```
src -> @
  assets -> @assets
  components -> @components
  router -> @router
  stores -> @stores
  views -> @views
  ...

```

### resolve.extensions

导入时想要省略的扩展名列表。默认值为 ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'] 。

`import {a} from './m'`

不建议忽略自定义导入类型的扩展名（例如：.vue），因为它会影响 IDE 和类型支持。

## server

### server.host

指定服务器监听哪个 IP 地址。默认值为 localhost ，只会监听本地的 127.0.0.1 。当我们开发移动端项目时，需要在手机浏览器上访问当前项目。这时候可以将 host 设置为 true 或 0.0.0.0 ，这样服务器就会监听所有地址，包括局域网和公网地址。

```js
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true, // 监听所有地址
  },
});
```

### sever.proxy

```js
// vite.config.js
import { defineConfig } from "vite";

// 配置代理跨域
export default defineConfig({
  server: {
    proxy: {
      // 字符串简写写法
      "/foo": "http://localhost:4567",
      // 选项写法
      "/api": {
        target: "http://jsonplaceholder.typicode.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // 正则表达式写法
      "^/fallback/.*": {
        target: "http://jsonplaceholder.typicode.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, ""),
      },
      // 使用 proxy 实例
      "/api": {
        target: "http://jsonplaceholder.typicode.com",
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy 是 'http-proxy' 的实例
        },
      },
      // Proxying websockets or socket.io
      "/socket.io": {
        target: "ws://localhost:3000",
        ws: true,
      },
    },
  },
});
```
