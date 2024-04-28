# Spacing

这里前面加个-都可以取负

## padding

```
p-0 padding: 0px;
px-0 padding-left: 0px;
padding-right: 0px;
py-0 padding-top: 0px;
padding-bottom: 0px;
ps-0 padding-inline-start: 0px;
pe-0 padding-inline-end: 0px;
pt-0 padding-top: 0px;
pr-0 padding-right: 0px;
pb-0 padding-bottom: 0px;
pl-0 padding-left: 0px;
p-px padding: 1px;
```

## margin

## space between

一次性对当前元素的所有直接子元素的 margin 生效

```
pace-x-0 > * + * margin-left: 0px;
space-y-0 > * + * margin-top: 0px;
space-x-0.5 > * + * margin-left: 0.125rem; /* 2px */
space-y-0.5 > * + * margin-top: 0.125rem; /* 2px */
space-x-1 > * + * margin-left: 0.25rem; /* 4px */
space-y-1 > * + * margin-top: 0.25rem; /* 4px */
-space-x-4
space-y-px > * + * margin-top: 1px;
space-y-reverse > * + * --tw-space-y-reverse: 1;
space-x-reverse > * + * --tw-space-x-reverse: 1;
```

```html
<div class="flex space-x-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```
