
# JLPT Battle

## お知らせ
```
2019.08.28 プロジェクトの立ち上げ
```

### Development Environment
```
ubuntu 16.04 / windows 10 / macOS
node.js 10.16.3
yarn 1.17.3
mysql 5.7.27
```

### Configuring a project

```bash
$ git clone https://github.com/h4ppyy/jlpt-battle
$ cd jlpt-battle
```

### Getting Started with Project
frontend
```bash
$ cd app_frontend
$ yarn install
$ yarn start
```
backend  
```bash
$ cd app_backend
$ cp config/database.template config/database.js

Create your database by referring to 'table.sql'
above the directory 'database'
And change the database connection information

$ yarn install
$ yarn start
```
daemon
```
We don't do it anymore
because I've already done 'yarn install'

$ cd app_backend
$ node daemon.js
```
Let's go !
[http://127.0.0.1:3000/](http://127.0.0.1:3000/)
