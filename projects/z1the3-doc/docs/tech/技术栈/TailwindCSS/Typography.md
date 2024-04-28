# Typography

## Font Family

```

font-sans font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

font-serif font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

font-mono font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
​

```

```html
<p class="font-sans ...">The quick brown fox ...</p>
<p class="font-serif ...">The quick brown fox ...</p>
<p class="font-mono ...">The quick brown fox ...</p>
```

## Font Size

```
text-xs font-size: 0.75rem; /* 12px */
text-sm font-size: 0.875rem; /* 14px */
text-base font-size: 1rem; /* 16px */
text-lg font-size: 1.125rem; /* 18px */
text-xl font-size: 1.25rem; /* 20px */
text-2xl font-size: 1.5rem; /* 24px */
text-3xl font-size: 1.875rem; /* 30px */
text-4xl font-size: 2.25rem; /* 36px */
text-5xl font-size: 3rem; /* 48px */
text-6xl font-size: 3.75rem; /* 60px */
text-7xl font-size: 4.5rem; /* 72px */
text-8xl font-size: 6rem; /* 96px */
text-9xl font-size: 8rem; /* 128px */
```

通过/可以设置 line-height，如果不加则会有默认 line-height

```html
<p class="text-base/6 ...">So I started to walk into the water...</p>
<p class="text-base/7 ...">So I started to walk into the water...</p>
<p class="text-base/loose ...">So I started to walk into the water...</p>

<p class="text-sm/[17px] ..."></p>
```

## Font Smoothing

```
antialiased -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;


subpixel-antialiased -webkit-font-smoothing: auto;
                      -moz-osx-font-smoothing: auto;
```

## Font Style

斜体和非斜体

```
italic font-style: italic;
not-italic font-style: normal;
```

## Font Weight

```
font-thin font-weight: 100;
font-extralight font-weight: 200;
font-light font-weight: 300;
font-normal font-weight: 400;
font-medium font-weight: 500;
font-semibold font-weight: 600;
font-bold font-weight: 700;
font-extrabold font-weight: 800;
font-black font-weight: 900;
```

## Font Variant Numeric

控制数字的样式
https://tailwindcss.com/docs/font-variant-numeric

## Letter Space

文本间空格的间距

```
tracking-tighter letter-spacing: -0.05em;
tracking-tight letter-spacing: -0.025em;
tracking-normal letter-spacing: 0em;
tracking-wide letter-spacing: 0.025em;
tracking-wider letter-spacing: 0.05em;
tracking-widest letter-spacing: 0.1em;
```

## Line Clamp

控制文本分行

```
line-clamp-1
line-clamp-2
line-clamp-3
line-clamp-4
line-clamp-none

```

```
overflow: hidden;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 1;
```

## Line Height

```
leading-3 line-height: .75rem; /* 12px */
leading-4 line-height: 1rem; /* 16px */
leading-5 line-height: 1.25rem; /* 20px */
leading-6 line-height: 1.5rem; /* 24px */
leading-7 line-height: 1.75rem; /* 28px */
leading-8 line-height: 2rem; /* 32px */
leading-9 line-height: 2.25rem; /* 36px */
leading-10 line-height: 2.5rem; /* 40px */
leading-none line-height: 1;
leading-tight line-height: 1.25;
leading-snug line-height: 1.375;
leading-normal line-height: 1.5;
leading-relaxed line-height: 1.625;
leading-loose line-height: 2;
```

## List Style Image

控制 li 前的 image

## List Style Position

li 前 point 算不算文字的一部分

```
list-inside list-style-position: inside;
list-outside list-style-position: outside;
```

## List Style Type

```
list-none list-style-type: none;
list-disc list-style-type: disc; 点
list-decimal list-style-type: decimal; 数字
```

## Text Align

控制文本对齐位置

```
text-left text-align: left;
text-center text-align: center;
text-right text-align: right;
text-justify text-align: justify;
text-start text-align: start;
text-end text-align: end;
```

## Text Color

https://tailwindcss.com/docs/text-color 更多颜色

```
text-inherit color: inherit;
text-current color: currentColor;
text-transparent color: transparent;
text-black color: rgb(0 0 0);
text-white
text-slate-50
```

## Text Decoration

overline 在文字上分
line-through 为删除线

```
underline text-decoration-line: underline;
overline text-decoration-line: overline;
line-through text-decoration-line: line-through;
no-underline text-decoration-line: none;
```

## Text Decoration Color

文字装饰物的颜色

## Text Decoration Style

文字装饰物的模式（solid,dash...）

## Text Decoration Thickness

文字装饰物（如下划线）的厚度

## Text Underline Offset

文字装饰物（如下划线）到文字的距离

## Text Transform

强制字母大小写化，以及单词开头大写（capitalize）

## Text Overflow

控制文字省略

```
// 阻止换行，并自动加省略号
truncate overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

// 并自动加省略号
text-ellipsis text-overflow: ellipsis;

text-clip text-overflow: clip;
```

## Text Wrap

```
text-wrap text-wrap: wrap;
text-nowrap text-wrap: nowrap;
text-balance text-wrap: balance; // 尽量给每一行平均分配
text-pretty text-wrap: pretty; // 保证最后一行不会只有一个单词
```

## Text Indent

控制文本开头前的空格数量

## Vertical Align

控制行内或表格文本的垂直对齐

```
align-baseline vertical-align: baseline;
align-top vertical-align: top;
align-middle vertical-align: middle;
align-bottom vertical-align: bottom;
align-text-top vertical-align: text-top;
align-text-bottom vertical-align: text-bottom;
align-sub vertical-align: sub;
align-super vertical-align: super;
```

## White Space

```
whitespace-normal white-space: normal; // 该换行时换行，换行符和空格会被转为一个空格或换行
whitespace-nowrap white-space: nowrap; // 不换行，换行符和空格会被转为一个空格或换行
whitespace-pre white-space: pre; // 默认不换行，换行符和空格不会折叠（类似模版字符串）
whitespace-pre-line white-space: pre-line; // 默认不换行，空格会折叠
whitespace-pre-wrap white-space: pre-wrap; // 默认不换行，都不会折叠
whitespace-break-spaces white-space: break-spaces; // 默认不换行，但是行末的空格会放到下一行的行首
```

## Word Break

控制一个词的换行

```
// 不断？
break-normal overflow-wrap: normal;
              word-break: normal;

// 在词后半部分断开
break-words overflow-wrap: break-word;

// 能在任何部位强制断开词
break-all word-break: break-all;

// 阻止中文断词
break-keep word-break: keep-all;
```

## Hyphens

https://tailwindcss.com/docs/hyphens

手动控制个别词的断开规则

## Content

伪类和伪元素的 content

```
content-none content: none;
```
