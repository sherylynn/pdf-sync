# pdf-sync

## Sync

pdf-sync will sync your read process between your different devices

pdf-sync 是一个同步阅读进度的 pdf 阅读工具

## Toolbox

Now you can enjoy your self pdf in toolbox

现在你可以在工具栏打开你自己的pdf阅读了

## How to config yourself server and app

you can download source code and config for yourself

你可以自己下载源码，并配置成你自己的服务器

### Pouchdb

open pouchdb-server console: {URL}/_utils

打开pouchdb-server 控制台

set admin patry user and passwd

设置自己的用户到 admin 组

create a Databases named pdf-sync

创建 pdf-sync 数据库

set permissions for your db {add user in admins options}

将数据库设置权限到先前建立的用户上

### Config.js

change string to your setting which configure above

将源码目录中config.js的相关信息配置成上述设定

    const config = {
    //  server_origin:'http://127.0.0.1:3456'
      server_origin: 'your_db_url',
      server_admin: 'your_db_admin',
      server_passwd: 'your_db_admin_passwd',
    };
    export { config, };
