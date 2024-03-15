# git actions

## 自动发布 release

注意 yaml 格式，缩进很重要

:::warning
必须要使用 checkout
读取 repo 否则会读不到 package.json
:::

- name: Checkout code
  uses: actions/checkout@v3

```yaml
# name属性用来指定这个工作流的名字
name: release CI
on:
  # 当对分支main进行push操作的时候,触发该条工作流
  push:
    branches: [main]
jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: 读取当前版本号
        id: version
        uses: ashley-taylor/read-json-property-action@v1.0
        with:
          path: ./package.json
          property: version
      - name: 创建GitHub Release
        id: create_release
        uses: actions/create-release@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ steps.version.outputs.value }}
          release_name: ${{ steps.version.outputs.value }}
          draft: false
          prerelease: false
```
