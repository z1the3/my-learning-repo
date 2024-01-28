---
tags: [Markdown]
---

# Markdown 语法

## 1.标题

```
# 一号标题
## 二号标题
####### 六号标题
```

## 2.分割线

```

---

```

## 3.列表

```
* 无序1
* 无序2

1. 有序1
1. 有序2
```

* 无序1
* 无序2

1. 有序1
1. 有序2

## 4.超链接

```
[描述](https://baidu.com)
```

[描述.com](https://baidu.com)

## 5.引用

```
> 你好
> 这是一个引用

> 你好
>
> 这样才可以换行
```

> 你好
> 这是一个引用

> 你好
>
> 这样才可以换行

## 6.代码

```js title="docusaurus.config.js"
  const a = 1
```

三个反引号加 `title="docusaurus.config.js"`

## 7.粗体和斜体

在MarkDown语法中，使用不同数量的*内容*号即可设定文字是粗体、斜体、或者两者都是。

*1个星号代表斜体*

**2个星号代表粗体**

***3个星号代表斜体+粗体***

```
*1个*号代表斜体*

**2个*号代表粗体**

***3个*号代表斜体+粗体***
```

## 8.图片

```
MarkDown中插入图片的语法是![描述](图片地址 "图片替代文本")。

其中描述在不同的MarkDown编辑器里有不同的效果，

有的编辑器并不会显示出描述的文本内容。

图片替代文本就是HTML中<img>标签中的alt属性，

这是在图片无法显示时的替代文本，也是用于描述图片内容的属性。

目前MarkDown语法暂时无法定于图片大小，

如果需要定于图片大小，可以使用HTML语言中的<img>标签。
```

<img src="https://pic2.zhimg.com/80/v2-f617b11cbb8b4ab314e441c7ec95f555_1440w.webp"/>

## 9.表格

```符号|是表格中每一列单元格的分割。
通常一行没有回车符的文本就代表表格中的一行。
表格头和表格体使用-------进行分割，
其中-的数量应该大于或等于3个。
在第3点钟的符号前后可以加入:设定单元格的对齐方式。
不加:时，表示默认的左对齐。
在前后都加:时，表示水平居中对其。
在尾部加:时，表示右对齐。
在单元格内换行，可以使用<br/>进行换行操作。
每一行的列数允许少于总列数

|title1|title2|title3|title4|
|---|:---:|:---|---:|
|left|center|left|right|
|aaaa<br/>aaa多行｜bbb|
```

|title1|title2|title3|title4|
|---|:---:|:---|---:|
|left|center|left|right|
|aaaa<br/>aaa多行|bbb|

## 10.caution

```
:::caution
小心
:::

:::note
笔记
:::
```

:::caution
小心
:::

:::note
笔记
:::

## 11.删除线

```
~~删除线~~
```

~~删除线~~

# Markdown 扩展

常用的 CommonMarkdown 非常简单

https://commonmark.org/help/

什么是 GitHub 风格的 Markdown？
GitHub Flavored Markdown（通常缩写为 GFM）是 Markdown 的方言，目前 GitHub.com 和 GitHub Enterprise 上的用户内容支持该方言。

该正式规范基于 CommonMark 规范，定义了该方言的语法和语义。

GFM 是 CommonMark 的严格超集。因此，GitHub 用户内容中支持且原始 CommonMark 规范中未指定的所有功能都称为扩展，并如此突出显示。

虽然 GFM 支持广泛的输入，但值得注意的是，GitHub.com 和 GitHub Enterprise 在 GFM 转换为 HTML 后执行额外的后处理和清理，以确保网站的安全性和一致性。

常见的 Markdown 扩展，例如 MDX、math 和 frontmatter。

https://github.github.com/gfm/#what-is-github-flavored-markdown-

## 引用

https://zhuanlan.zhihu.com/p/24575242
