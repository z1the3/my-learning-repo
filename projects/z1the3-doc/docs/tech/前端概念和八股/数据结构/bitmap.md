# bitmap

## 集合表示

Bitmap 可以用来表示一个集合，其中每个元素的存在与否由一个位（bit）来表示。
适用于元素范围已知且较小的情况。

## 快速查找

由于 Bitmap 使用位来表示元素，查找操作可以在常数时间内完成。
适合用于需要频繁查找的场景。

## 去重

Bitmap 可以用于快速去重，通过设置相应位来标记元素是否出现过。
适用于需要处理大量数据并去重的场景。

## 计数

可以扩展 Bitmap 来实现计数功能，例如使用多个位来表示一个元素的计数。
适用于需要统计元素出现次数的场景。

## 空间优化

Bitmap 通过使用位而不是字节来存储信息，可以显著减少空间消耗。
适用于内存受限的环境。

## 类似打表

```js
function bitmapExample(nums) {
  // 假设元素范围在0到99之间
  const bitmap = new Array(100).fill(0); // 初始化Bitmap

  // 去重
  nums.forEach((num) => {
    bitmap[num] = 1; // 标记元素存在
  });

  // 查找
  function exists(x) {
    return bitmap[x] === 1;
  }

  // 示例用法
  console.log(exists(10)); // 输出true或false，取决于10是否在nums中
  console.log(exists(50)); // 输出true或false，取决于50是否在nums中
}

// 示例调用
bitmapExample([10, 20, 30, 10, 50]);
```
