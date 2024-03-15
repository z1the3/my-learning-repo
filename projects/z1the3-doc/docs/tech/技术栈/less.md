# less

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
