# TailwindCss

## 官方文档

https://tailwindcss.com/docs/utility-first

## css 原子化

最早的 css 原子化--bootstrap
提前声明好可能会用到的 css，开发者引用即可

tailwindcss 的原子化更精细灵活

支持按需加载，按照 DSL 规则书写 class

DSL:
每一个 class 不再是单一的 class 对应着样式
可以通过语法进行组合，传入参数

class 书写变成书写等价的 less/sass

**tailwindcss**只是 postcss 的一个插件

## 优点

0. 不用在类名上花费精力

1. css 文件不会像传统方案不断膨胀

2. html 中的类名是局部的，更改不会影响全局，进而造成意想不到的更改

3. 使用普通 css 很难判断当前 css 代码是否真的没用了而可以删除，tailwind css 中组件与样式强绑定在一起，降低了冗余代码的可能性

## 缺点

遇到 Tailwind CSS 无法覆盖的场景，如一些复杂的伪类或覆盖第三方组件库的样式

需要用 cssinjs 或预编译覆盖

## 为什么不直接使用行内样式

- 行内样式任何值都是数字，而不是来自预定义的设计系统
- 行内样式需要媒体查询，而不是直接使用 tailwind 的响应式工具
- hover,focus 难以实现，而不是使用 tailwind 的状态变量

## 状态

```js
hover:bg-sky-500
focus:...
//对子元素起效
first:...
last:....
odd:....
even:....
// 可以堆叠
dark:md:hover:bg-fuchsia-600
// 表格相关
required:
invalid:
disabled:
```

### 状态组 group

`group-{modifier}`

```html
<a href="#" class="group">
  <div class="flex items-center space-x-3">
    <svg class="group-hover:stroke-white" fill="none" viewBox="0 0 24 24">
      <!-- ... -->
    </svg>
    <h3 class="group-hover:text-white">New project</h3>
  </div>
  <p class="group-hover:text-white">
    Create a new project from a variety of starting templates.
  </p>
</a>
```

group 触发 hover，透传到每个子元素上

如果 group 需要区分
`group/{name}`和`group-hover/{name}`配合使用

```html
<a href="#" class="group/item">
  <div class="flex items-center space-x-3">
    <svg class="group-hover/item:stroke-white" fill="none" viewBox="0 0 24 24">
      <!-- ... -->
    </svg>
    <h3 class="group-hover:text-white">New project</h3>
  </div>
  <p class="group-hover:text-white">
    Create a new project from a variety of starting templates.
  </p>
</a>
```

#### 修饰符

`group-[选择器]`不通过伪类拿到指定的 group

`group-[选择器_&]`更精确的拿到指定的 group

```html
<div class="group">
  <!--要求父亲group是同级第三个这里才会按block显示-->
  <div class="group-[:nth-of-type(3)_&]:block">
    <!-- ... -->
  </div>
</div>
```

### peer

同级直接联动

不用使用 js

```html
<input type="email" class="peer ..." />
<p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
  Please provide a valid email address.
</p>
```

`peer-[伪类]`如 focus required disabled

**同级 peer 必须要放在`peer-[伪类]`前面，否则会失效**

类似 group

可以通过`peer/{name}`和`peer-[伪类]/{name}`进行区分

通过`peer-[选择器]`和`_&`精准查找

### `*-{modifier}`

父元素 `*:utility` 在所有子元素上应用

子类不能覆盖这一类型的样式

### `has-[伪类]:utility`

子代触发该伪类, 则父元素触发该效果

### peer-has-\*

元素 1 标有 peer

元素 2 通过 peer-has 联动元素 1 的**子元素**的状态

```html
<fieldset>
  <legend>Today</legend>

  <div>
    <label class="peer ...">
      <input type="checkbox" name="todo[1]" checked />
      Create a to do list
    </label>
    <svg class="peer-has-[:checked]:hidden ..."></svg>
  </div>
</fieldset>
```

### before and after

一旦使用一个`before:utility`

tailwind 会自动加上该 utility，不用手动添加

```
before:content-[``]
```

当然可以手动覆盖

:::note
考虑到 preflight base styles，可能自动添加会失效

则需要手动加上
:::

### placeholder 文本

`placeholder:文本相关utility`来控制输入框中占位文本的样式

### marker

控制 list 中 counter 或 bullet 的样式，

可以用在 ul 上继承到 li，或者直接用在 li 上

### selection

控制选中文本的样式

在 body 标签上比较方便

### first-line: first-letter

控制第一行和第一个字母

### 顺序误区

不同的组织顺序可能会触发不同效果

```css
/* dark:group-hover:opacity-100 */
.dark .group:hover .dark\:group-hover\:opacity-100 {
  opacity: 1;
}

/* group-hover:dark:opacity-100 */
/* 这种情况dark变成group类的子类才能触发 */
.group:hover .dark .group-hover\:dark\:opacity-100 {
  opacity: 1;
}
```

整个元素被 hover 时触发和元素为 h1 时被 hover

```css
/* prose-headings:hover:underline */
.prose-headings\:hover\:underline:hover :is(:where(h1, h2, h3, h4, th)) {
  text-decoration: underline;
}

/* hover:prose-headings:underline */
.hover\:prose-headings\:underline :is(:where(h1, h2, h3, h4, th)):hover {
  text-decoration: underline;
}
```

### 原生 dialog 标签 backdrop:bg-red

### 喜好颜色主题

prefers-color-scheme 媒体查询

在操作系统层面获取用户喜好

## 响应式

https://tailwindcss.com/docs/responsive-design

tailwind 提供响应式断点的前缀

分别对应媒体查询在屏幕不同尺寸的情况

如
sm -> `@media (min-width: 640px){...}`

```html
<!-- Width of 16 by default, 32 on medium screens, and 48 on large screens -->
<img class="w-16 md:w-32 lg:w-48" src="..." />
```

### 限制范围

md 只限制了 min 范围

想要限制 max 需要用 max 修饰符并堆叠

```html
<div class="md:max-xl:flex">
  <!-- ... -->
</div>
```

### 任意值端点

适用于在主题中没有意义时

```html
<div class="min-[320px]:text-center max-[600px]:bg-sky-300">
  <!-- ... -->
</div>
```

## dark mode

## 自定义样式

## 增加 utilities
