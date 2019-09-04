

# JLPT Battle

## お知らせ
```
2019.08.28 プロジェクトの立ち上げ
2019.09.03 'redux.js' を導入した
2019.09.04 'database migrate shell' 作成した
```

<img src="https://github.com/h4ppyy/jlpt-battle/blob/master/dev_history/img/www.gif?raw=true" width="100%"></img>

<img src="https://github.com/h4ppyy/jlpt-battle/blob/master/dev_history/img/p4.png?raw=true" width="100%"></img>

<img src="https://github.com/h4ppyy/jlpt-battle/blob/master/dev_history/img/p5.png?raw=true" width="100%"></img>

### Development Environment
```
ubuntu 16.04 / windows 10 / macOS
node.js 10.16.3
yarn 1.17.3
mysql 5.7.27
python 3.7.4
```

### Configuring a project

```bash
$ git clone https://github.com/h4ppyy/jlpt-battle
$ cd jlpt-battle
```

### Getting Started with Project

migrate
Modify the database information in 'migrate.py before you work on it
```bash
$ cd app_daemon
$ python3 -m venv venv
$ . venv/bin/activate
$ pip install -r requirements.txt
$ python migrate.py
```

frontend
```bash
$ cd app_frontend
$ yarn install
$ yarn start
```
backend  
```bash
$ cd app_backend
$ cp config/config.template config/config.js

Create your database by referring to 'table.sql'
above the directory 'database'
And change the database connection information

$ yarn install
$ yarn start

If you're building a development environment
$ yarn global add nodemon
$ nodemon app.js
```
daemon
```bash
$ cd app_daemon
$ python daemon.py
```
Let's go !
[http://127.0.0.1:3000/](http://127.0.0.1:3000/)
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTIxNDI4OTE2OTUsLTU0OTk1NDIwXX0=
-->