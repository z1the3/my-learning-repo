# TailwindCss

## 官方文档

https://tailwindcss.com/docs/utility-first

## css原子化

最早的css原子化--bootstrap
提前声明好可能会用到的css，开发者引用即可

tailwindcss的原子化更精细灵活

支持按需加载，按照DSL规则书写class

DSL:
每一个class不再是单一的class对应着样式
可以通过语法进行组合，传入参数

class书写变成书写等价的less/sass

**tailwindcss**只是postcss的一个插件

## 优点

0. 不用在类名上花费精力

0. css文件不会像传统方案不断膨胀

0. html中的类名是局部的，更改不会影响全局，进而造成意想不到的更改

0. 使用普通css很难判断当前css代码是否真的没用了而可以删除，tailwind css中组件与样式强绑定在一起，降低了冗余代码的可能性

## 为什么不直接使用行内样式

* 行内样式任何值都是数字，而不是来自预定义的设计系统
* 行内样式需要媒体查询，而不是直接使用tailwind的响应式工具
* hover,focus难以实现，而不是使用tailwind的状态变量

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
    <svg class="group-hover:stroke-white" fill="none" viewBox="0 0 24 24"><!-- ... --></svg>
    <h3 class="group-hover:text-white">New project</h3>
  </div>
  <p class="group-hover:text-white">Create a new project from a variety of starting templates.</p>
</a>
```

group触发hover，透传到每个子元素上

如果group需要区分
`group/{name}`和`group-hover/{name}`配合使用

```html
<a href="#" class="group/item">
  <div class="flex items-center space-x-3">
    <svg class="group-hover/item:stroke-white" fill="none" viewBox="0 0 24 24"><!-- ... --></svg>
    <h3 class="group-hover:text-white">New project</h3>
  </div>
  <p class="group-hover:text-white">Create a new project from a variety of starting templates.</p>
</a>

```

#### 修饰符

`group-[选择器]`不通过伪类拿到指定的group

`group-[选择器_&]`更精确的拿到指定的group

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

不用使用js

```html
    <input type="email" class="peer ..."/>
    <p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
      Please provide a valid email address.
    </p>
```

`peer-[伪类]`如focus required disabled

**同级peer必须要放在`peer-[伪类]`前面，否则会失效**

类似group

可以通过`peer/{name}`和`peer-[伪类]/{name}`进行区分

通过`peer-[选择器]`和`_&`精准查找

## 响应式

## dark mode

## 复用样式

## 自定义样式

## 增加utilities
