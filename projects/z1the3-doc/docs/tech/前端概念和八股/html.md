# html

## onChange 和 onInput 的区别

### 原生

oninput 在输入内容的时候，持续调用，通过 element.value 可以持续取值，失去焦点和获取焦点不会被调用。
onchange 在输入期间不会被调用，在失去焦点且失去焦点时的 value 与获得焦点时的 value 不一致（输入内容有变化）的时候才会被调用。
如果需要检测用户一个输入框的内容是否有变化，onchange 就能很好地处理这种情况。

### react

React 的 onInput 和 onChange 并没有多少区别，其作用都是在用户持续输入的时候触发，不在失去获取或者失去焦点的时候触发。
要获取焦点相关的事件需要通过 onFocus 和 onBlur。而需要检测用户输入的内容是否有变化则需要手动去取值对比，没有原生的 onChange 那样便捷。

onInput 的参数是`React.FormEvent<HTMLInputElement>`,而 onChange 是 React.`ChangeEvent<HTMLInputElement>`，已经区分开了表单 Form 事件和 Change 事件。

作者：AteaYang
链接：https://juejin.cn/post/6935052374650126350
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

## onload 和 document.ready

页面加载完成有两种事件，一是 ready，表示文档结构已经加载完成(不包含图片等非文字媒体文件)，二是 onload，指示页面包含图片等文件在内的所有元素都加载完成。
ready 事件在 DOM 结构绘制完成之后就会执行，这样能确保就算有大量的媒体文件没加载出来，JS 代码一样可以执行。
load 事件必须等到网页中所有内容全部加载完毕之后才被执行。如果一个网页中有大量的图片的话，则就会出现这种情况:网页文档已经呈现出来，但由于网页数据还没有完全加载完毕，导致 load 事件不能够即时被触发，
ready 与 load 谁先执行?面试时经常会被问到这个问题:ready 与 load 那一个先执行那一个后执行?答案当然是 ready 先执行。
