# html5 新特性

## 1. 语义化标签

HTML 中的元素、属性、属性值有用含义
e.g.有序列表用 ol，无序列表用 ul，lang 属性表示内容所使用的语言

- header：定义文档的页眉（头部）；
- nav：定义导航链接的部分；
- footer：定义文档或节的页脚（底部）；
- article：定义文章内容；
- section：定义文档中的节（section、区段）；
- aside：定义其所处内容之外的内容（侧边）；

## 2. 媒体标签

audio video source

```html
<audio src='' controls autoplay loop='true'></audio>
<video src='' poster='imgs/aa.jpg' controls></video>
<video>
 <source src='aa.flv' type='video/flv'></source>
 <source src='aa.mp4' type='video/mp4'></source>
</video>
```

## 3. 表单

input 标签新增属性：placeholder、autocomplete、autofocus、required

表单类型

- email ：能够验证当前输入的邮箱地址是否合法
- url ： 验证 URL
- number ： 只能输入数字，其他输入不了，而且自带上下增大减小箭头，max 属性可以设置为最大值，min 可以设置为最小值，value 为默认值。
- search ： 输入框后面会给提供一个小叉，可以删除输入的内容，更加人性化。
- range ： 可以提供给一个范围，其中可以设置 max 和 min 以及 value，其中 value 属性可以设置为默认值
- color ： 提供了一个颜色拾取器
- time ： 时分秒
- date ： 日期选择年月日
- datatime ： 时间和日期(目前只有 Safari 支持)
- datatime-local ：日期时间控件
- week ：周控件
- month：月控件

表单属性

- placeholder ：提示信息
- autofocus ：自动获取焦点
- autocomplete=“on” 或者 autocomplete=“off” 使用这个属性需要有两个前提：
- 表单必须提交过
- 必须有 name 属性。
- required：要求输入框不能为空，必须有值才能够提交。
- pattern=" " 里面写入想要的正则模式，例如手机号 patte="^(+86)?\d{10}$"
- multiple：可以选择多个文件或者多个邮箱
- form=" form 表单的 ID"

## 4. 进度条，度量器（progress 标签）

## 5. DOM 查询

- document.querySelector()
- document.querySelectorAll()
  它们选择的对象可以是标签，可以是类(需要加点)，可以是 ID(需要加#)

## 6. Web 存储

HTML5 提供了两种在客户端存储数据的新方法：

- localStorage 没有时间限制的数据存储
- sessionStorage 针对一个 session 的数据存储

## 7. history API：go、forward、back、pushstate

## 8. canvas（画布）、Geolocation（地理定位）、websocket（通信协议）

## 9. 拖拽
