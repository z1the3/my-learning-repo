# Diff算法

只比较两个节点的一层子节点，就是同层比较的意思, 不比较更深层
在比较单一节点时如果 key 值不同，直接替换为新节点
diff 算法最重要的内容是比较在 key 相同且两个节点都有子节点时子节点的差异

<img src="https://cdn.jsdelivr.net/gh/z1the3/myCDNassets/assets/monorepo-project/projects/z1the3-doc/source/WeChatcc0c95b6a623b388bc8efc28742b14d1.jpg" width="1200"/>

vue2 使用双端头尾比较

vue3 使用最长递增序列 + 静态标记
