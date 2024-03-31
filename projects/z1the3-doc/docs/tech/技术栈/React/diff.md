# diff

## 更新策略

还是只对子组件做递归更新

## diff

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/WeChat79b74639b63015e2b71c53c668c99c71.jpg" width="500"/>

前提： 只对同级节点比较，如果跨层级，则不复用

用 key 来构建一个老节点的 map，复用后要从 map 中删除
用 lastPlacedIndex 表示最后一个不需要移动的节点

思路是递增法
通过比较当前列表中的节点在原列表中拿到位置是否递增，来判断是否需要移动

将 A B C D E F 修改为 A C E B G 的执行顺序

-先将 ABCDEF 存到 map 里

-指针遍历 ACEBG
-lastPlacedIndex = 0
-A 在 map 里面存在，而且位置相同，复用节点更新属性
-C 对比 lastPlacedIndex(0) < oldIndex(2)，lastPlacedIndex = 2，**位置不动，只更新属性**
-E 对比 lastPlacedIndex (2)< oldIndex(4)，lastPlacedIndex = 4，位置不动，只更新属性 -（以上 ACE 的相对次序一致，所以不用改变位置
-B 对比 lastPlacedIndex(4) > oldIndex(2)，需要移动位置并更新属性
-G 在 map 里找不到，需要创建并插入  
-将 map 中剩余的元素 D F 标记为删除

-修改 dom 的顺序: 遍历完先删除，然后更新与移动，最后做插入操作

## 另一个例子

ABCDEF FABCDE

先建立 ABCDEF 的 map

遍历 FABCDE

F 在表中 index5，则 lastPlacedIndex 为 5,**F 位置不动，只更新属性**

ABCDE 的 index 都小于 lastPlacedIndex, 需要移动位置并更新属性

没有删除和插入

当一个集合只是把最后一个节点移到了第一个，React 会把前面的节点依次移动，

而 Vue 只会把最后一个节点移到第一个。总体来说，Vue 的方式比较高效。
