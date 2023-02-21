## 介绍

`MySQL`是一个开源数据库管理系统，通常作为流行的`LEMP（Linux、Nginx、MySQL/MariaDB、PHP/Python/Perl）`堆栈的一部分安装

它实现了关系模型和结构化查询语言`(SQL)`来管理和查询数据

本教程解释了如何在`CentOS 8`服务器上安装`MySQL`V8

要完成本教程，您需要一台运行`CentOS 8`的服务器

## 第 1 步 — 安装MySQL

在`CentOS 8`上，`MySQL`V8可从默认存储库中获得

运行以下命令来安装`mysql-server`包和它的一些依赖项

```
sudo dnf install mysql-server
```

```
Output. . .
Install  49 Packages
 
Total download size: 46 M
Installed size: 252 M
```

按`y`和`ENTER`确认您要继续：

```
Is this ok [y/N]: y
```

软件包将`MySQL`配置为名为`mysqld.service`的`systemd`服务

需要使用以下`systemctl`命令启动

```
sudo systemctl start mysqld.service
```

要检查服务是否正常运行，请运行以下命令

```
sudo systemctl status mysqld
```

如果`MySQL`启动成功，输出将显示`MySQL`服务处于`active`活动状态：

```
Output● mysqld.service - MySQL 8.0 database server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: active (running) since Thu 2020-03-12 14:07:41 UTC; 1min 7s ago
 Main PID: 15723 (mysqld)
   Status: "Server is operational"
    Tasks: 38 (limit: 5056)
   Memory: 474.2M
   CGroup: /system.slice/mysqld.service
           └─15723 /usr/libexec/mysqld --basedir=/usr
 
Mar 12 14:07:32 cent-mysql-3 systemd[1]: Starting MySQL 8.0 database server...
Mar 12 14:07:32 cent-mysql-3 mysql-prepare-db-dir[15639]: Initializing MySQL database
Mar 12 14:07:41 cent-mysql-3 systemd[1]: Started MySQL 8.0 database server.
```

使用以下命令将`MySQL`设置为在服务器启动时启动

```
sudo systemctl enable mysqld
```

注意：如果你想改变这个行为并禁止`MySQL`：

```
sudo systemctl disable mysqld
```

## 第 2 步 — 保护MySQL

MySQL包含一个安全脚本

允许您更改一些默认配置选项以提高MySQL的安全性

要使用安全脚本，请运行以下命令：

```
sudo mysql_secure_installation
```

这将引导您完成一系列提示，询问您是否要对MySQL安装的安全选项进行某些更改

第一个提示将询问您是否要设置验证密码插件

您可以使用它来测试MySQL密码的强度

如果您选择设置验证密码插件，脚本将要求您选择密码验证级别(不建议选择)

最强级别（输入选择2）将要求您的密码长度至少为8个字符，并且包括大写、小写、数字和特殊字符的混合

```
OutputSecuring the MySQL server deployment.
Connecting to MySQL using a blank password.
VALIDATE PASSWORD COMPONENT can be used to test passwords
and improve security. It checks the strength of password
and allows the users to set only those passwords which are

secure enough. Would you like to setup VALIDATE PASSWORD component?
Press y|Y for Yes, any other key for No: Y

There are three levels of password validation policy:
LOW    Length >= 8
MEDIUM Length >= 8, numeric, mixed case, and special characters
STRONG Length >= 8, numeric, mixed case, special characters and dictionary file
Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG: 2
```

无论您是否选择设置验证密码插件

下一个提示都是为MySQL root用户设置密码

输入并确认您选择的密码：`123456`

```
Output
Please set the password for root here.
New password: （输入是隐藏的）
Re-enter new password: （输入是隐藏的）
```

如果您使用了验证密码插件，您将收到有关新密码强度的反馈。

然后脚本将询问您是要继续使用刚刚输入的密码还是要输入新密码。

假设您对刚刚输入的密码强度感到满意，请输入Y继续执行脚本：

```
Output
Estimated strength of the password: 100 
Do you wish to continue with the password provided?
是否要继续使用提供的密码？   y
Remove anonymous users?
是否删除匿名用户？ y
Disallow root login remotely?
不允许root用户远程登录？ n
Remove test database and access to it?
是否删除测试数据库并访问它？ n
Reload privilege tables now?
是否立即重新加载特权表？ n
```

## 第 3 步 — 测试MySQL

使用以下命令以root (-u root)身份连接到MySQL，提示输入密码(-p)，并返回安装版本

```
mysqladmin -u root -p version
```

```
mysqladmin  Ver 8.0.17 for Linux on x86_64 (Source distribution)
Copyright (c) 2000, 2019, Oracle and/or its affiliates. All rights reserved.
 
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
 
Server version        8.0.17
Protocol version    10
Connection        Localhost via UNIX socket
UNIX socket        /var/lib/mysql/mysql.sock
Uptime:            2 hours 52 min 37 sec
 
Threads: 2  Questions: 20  Slow queries: 0  Opens: 131  
Flush tables: 3  Open tables: 48  Queries per second avg: 0.001
```

连接到MySQL并开始向其中添加数据，请运行以下命令：

```
mysql -u root -p
```

```
Enter password: （输入是隐藏的）
```

输入您的MySQL root用户密码后，您将看到MySQL提示：

```
mysql>
```

推出`Mysql V8`

```
mysql> exit
```

## 第 4 步 — 远程MySQL
以A模式进入数据库
```
mysql -u root -A -p
```
输入密码
```
Enter password:(输入是隐藏的)
```
使用mysql为活动数据库
```
mysql> use mysql;
```
查看当前用户
```
mysql> select user,host from user;
```
结果如下图所示
```
+------------------+-----------+
| user             | host      |
+------------------+-----------+
| mysql.infoschema | localhost |
| mysql.session    | localhost |
| mysql.sys        | localhost |
| root             | localhost |
+------------------+-----------+
```
授权用户root的host修改
```
mysql > update user set host='%' where user='root';
```
授权用户root
```
mysql > grant all privileges on test.* to root@'%';
```
允许远程连接
```
mysql > GRANT ALL ON *.* TO 'root'@'%';
```
设置远程连接密码`Mysql2580c++`
```
mysql > ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
```
退出数据库
```
mysql > exit
```

## 结语

恭喜你看到了最后！

重要提示：云服务器防火墙记得打开`3306`端口
