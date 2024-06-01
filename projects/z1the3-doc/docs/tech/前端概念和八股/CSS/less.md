# less

## 嵌套

```css
//less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
  & .test {
    width: 300px;
  }
}
//css
#header {
  color: black;
}
#header .navigation {
  font-size: 12px;
}
#header .logo {
  width: 300px;
}
#header .test {
  width: 300px;
}
```

### &关键字:对父选择器的引用

注：它重复**所有的祖先选择器**，而不是仅仅重复最近的父选择器。
祖先选择器为.demo

- && 表示.demo.demo
- & & 表示.demo .demo
- &, & 表示.demo, .demo

## 定义变量

```css
@color: #f93d66;

.xkd {
  border: 1px solid @color;
  h3 {
    background-color: @color;
  }
  .circle {
    color: @color;
  }
}
```

```yaml
- name: 创建GitHub Release
  id: create_release
  uses: actions/create-release@latest
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: ${{ steps.version.outputs.value }}
    release_name: ${{ steps.version.outputs.value }}
    body: "图床更新"
    draft: false
    prerelease: false
- name: 读取当前版本号
  id: version
  uses: ashley-taylor/read-json-property-action@v1.0
  with:
    path: ./package.json
    property: version
```
