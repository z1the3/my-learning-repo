# linux 命令

https://www.runoob.com/linux/linux-command-manual.html

## cat

`cat [选项] [文件]`

显示文件内容：cat filename 会将指定文件的内容输出到终端上。

连接文件：cat file1 file2 > combined_file 可以将 file1 和 file2 的内容连接起来，并将结果输出到 combined_file 中。

创建文件：可以使用 cat 命令来创建文件，例如 cat > filename，然后你可以输入文本（读取标准输入），按 Ctrl+D 来保存并退出。

**在终端显示文件**：可以将 cat 与管道（|）结合使用，用来显示其他命令的输出，例如 ls -l | cat 会将 ls -l 的输出通过 cat 打印到终端上。

- 查看文件内容：显示文件 filename 的内容。
  `cat filename`

- 创建文件：将标准输入重定向到文件 filename，覆盖该文件的内容。
  如上 `cat > filename`

- 追加内容到文件：将标准输入追加到文件 filename 的末尾。
  `cat >> filename`

- 查看文件的最后几行：显示文件 filename 的最后 10 行。
  `cat filename | tail -n 10`

## chown

https://www.runoob.com/linux/linux-comm-chown.html

Linux chown（英文全拼：change owner）命令用于设置文件所有者和文件关联组的命令。

Linux/Unix 是多人多工操作系统，所有的文件皆有拥有者。利用 chown 将指定文件的拥有者改为指定的用户或组，用户可以是用户名或者用户 ID，组可以是组名或者组 ID，文件是以空格分开的要改变权限的文件列表，支持通配符。 。

chown 需要超级用户 root 的权限才能执行此命令。

把 /var/run/httpd.pid 的所有者设置 root：

```
chown root /var/run/httpd.pid
```

将文件 file1.txt 的拥有者设为 runoob，群体的使用者 runoobgroup :

```
chown runoob:runoobgroup file1.txt
```

将当前前目录下的所有文件与子目录的拥有者皆设为 runoob，群体的使用者 runoobgroup:

```
chown -R runoob:runoobgroup *
```
