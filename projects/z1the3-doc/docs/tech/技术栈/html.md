# html

## window.onload

The load event is fired when the whole page has loaded, including all dependent resources such as stylesheets, scripts, iframes, and images.

## document.ready 和 window.onload

`(document).ready:`是 DOM 结构绘制完毕后就执行，不必等到加载完毕。 意思就是 DOM 树加载完毕，就执行，不必等到页面中图片或其他外部文件都加载完毕。并且可以写多个.ready。

window.onload:是页面所有元素都加载完毕，包括图片等所有元素。只能执行一次。
